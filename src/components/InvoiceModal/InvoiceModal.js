import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { TextField, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import './InvoiceModal.css';

Modal.setAppElement('#root');

const InvoiceModal = ({ isOpen, onClose, onSave, invoice }) => {
  const [localInvoice, setLocalInvoice] = useState(getInitialInvoice());

  useEffect(() => {
    if (invoice) {
      setLocalInvoice(invoice);
    } else {
      setLocalInvoice(getInitialInvoice());
    }
  }, [invoice]);

  function getInitialInvoice() {
    return {
      id: `INV-${Math.floor(Math.random() * 10000)}`,
      customerName: '',
      customerEmail: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [],
      notes: '',
      total: 0,
    };
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setLocalInvoice((prev) => {
      const updatedItems = prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'price') {
            updatedItem.amount = updatedItem.quantity * updatedItem.price;
          }
          return updatedItem;
        }
        return item;
      });

      const total = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      return { ...prev, items: updatedItems, total };
    });
  };

  const handleAddItem = () => {
    setLocalInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0, amount: 0 }],
    }));
  };

  const handleRemoveItem = (index) => {
    setLocalInvoice((prev) => {
      const updatedItems = prev.items.filter((_, i) => i !== index);
      const total = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      return { ...prev, items: updatedItems, total };
    });
  };

  const handleSave = () => {
    onSave(localInvoice);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Invoice"
      className="invoice-modal"
      overlayClassName="invoice-modal-overlay"
    >
      <div className="invoice-form">
        <h2>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</h2>
        <div className="form-grid">
          <TextField
            label="Invoice #"
            name="id"
            value={localInvoice.id}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
            disabled
          />
          <TextField
            label="Customer Name"
            name="customerName"
            value={localInvoice.customerName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Customer Email"
            name="customerEmail"
            value={localInvoice.customerEmail}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Invoice Date"
            name="date"
            type="date"
            value={localInvoice.date}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={localInvoice.dueDate}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <TableContainer component={Paper} className="invoice-items-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localInvoice.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      inputProps={{ min: 1 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </TableCell>
                  <TableCell align="right">${item.amount.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleRemoveItem(index)} color="secondary">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button startIcon={<Add />} onClick={handleAddItem} variant="outlined" color="primary" className="add-item-btn">
          Add Item
        </Button>
        <TextField
          label="Notes"
          name="notes"
          value={localInvoice.notes}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
        />
        <div className="invoice-total">
          <strong>Total: ${localInvoice.total.toFixed(2)}</strong>
        </div>
        <div className="modal-actions">
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Invoice
          </Button>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
