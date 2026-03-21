import React, { useState } from 'react';
import { useApi }        from '../hooks/useApi';
import { useTable }      from '../hooks/useTable';
import { useModal }      from '../hooks/useModal';
import { farmerService } from '../services/farmerService';
import { useAuth }       from '../context/AuthContext';
import DataTable         from '../components/common/DataTable';
import Modal             from '../components/common/Modal';
import ConfirmDialog     from '../components/common/ConfirmDialog';
import FormField, { Input } from '../components/common/FormField';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { formatDate } from '../utils/formatUtils';
import '../styles/pages.css';

const EMPTY = { name: '', email: '', phone: '', address: '' };

export default function FarmersPage() {
  const { data, loading, refetch } = useApi(farmerService.getAll);
  const table    = useTable(data || [], ['name', 'email', 'phone']);
  const formModal = useModal();
  const delModal  = useModal();
  const { canCreate, canUpdate, canDelete } = useAuth();
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleOpen = (row = null) => {
    setForm(row ? { name: row.name, email: row.email, phone: row.phone||'', address: row.address||'' } : EMPTY);
    formModal.open(row);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    setSaving(true);
    try {
      if (formModal.data?.id) {
        await farmerService.update(formModal.data.id, form);
        toast.success('Farmer updated!');
      } else {
        await farmerService.create(form);
        toast.success('Farmer created!');
      }
      formModal.close(); refetch();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await farmerService.delete(delModal.data.id);
      toast.success('Farmer deleted');
      delModal.close(); refetch();
    } finally { setDeleting(false); }
  };

  const cols = [
    { key: 'name',      label: 'Name' },
    { key: 'email',     label: 'Email' },
    { key: 'phone',     label: 'Phone' },
    { key: 'address',   label: 'Address' },
    { key: 'createdAt', label: 'Created', render: r => formatDate(r.createdAt) },
    { key: 'status',    label: 'Status', render: r => (
      <span className={`badge badge--${r.status?.toLowerCase() || 'pending'}`}>
        {r.status || 'PENDING'}
      </span>
    )},
  ];

  return (
    <div className="page fade-in">
      <div className="page__header">
        <div>
          <h2 className="page__title">Farmers</h2>
          <p className="page__sub">Manage registered farmers</p>
        </div>
        {canCreate() && (
          <button className="btn btn--primary" onClick={() => handleOpen()}>
            <MdAdd size={18} /> Add Farmer
          </button>
        )}
      </div>

      <DataTable
        columns={cols} loading={loading}
        rows={table.rows} totalRows={table.totalRows}
        search={table.search} onSearch={table.handleSearch}
        sortKey={table.sortKey} sortDir={table.sortDir} onSort={table.handleSort}
        page={table.page} totalPages={table.totalPages} onPageChange={table.setPage}
        actions={row => (
          <>
            {canUpdate() && <button className="btn btn--icon edit" onClick={() => handleOpen(row)}><MdEdit size={17}/></button>}
            {canDelete() && <button className="btn btn--icon del"  onClick={() => delModal.open(row)}><MdDelete size={17}/></button>}
          </>
        )}
      />

      <Modal isOpen={formModal.isOpen} onClose={formModal.close}
             title={formModal.data?.id ? 'Edit Farmer' : 'Add Farmer'}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <FormField label="Full Name" required>
              <Input placeholder="John Doe" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
            </FormField>
            <FormField label="Email" required>
              <Input type="email" placeholder="john@farm.com" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} />
            </FormField>
            <FormField label="Phone">
              <Input placeholder="9876543210" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} />
            </FormField>
            <FormField label="Address">
              <Input placeholder="Village, District" value={form.address} onChange={e => setForm(f=>({...f,address:e.target.value}))} />
            </FormField>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={formModal.close}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving...' : (formModal.data?.id ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={delModal.isOpen} onClose={delModal.close} onConfirm={handleDelete}
        loading={deleting} title="Delete Farmer"
        message={`Delete ${delModal.data?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
