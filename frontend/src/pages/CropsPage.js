import React, { useState } from 'react';
import { useApi }      from '../hooks/useApi';
import { useTable }    from '../hooks/useTable';
import { useModal }    from '../hooks/useModal';
import { cropService } from '../services/cropService';
import { useAuth }     from '../context/AuthContext';
import DataTable       from '../components/common/DataTable';
import Modal           from '../components/common/Modal';
import ConfirmDialog   from '../components/common/ConfirmDialog';
import FormField, { Input, Select } from '../components/common/FormField';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { SEASONS } from '../utils/constants';
import '../styles/pages.css';

const EMPTY = { name: '', variety: '', season: '', description: '', growthDurationDays: '' };

export default function CropsPage() {
  const { data, loading, refetch } = useApi(cropService.getAll);
  const table     = useTable(data || [], ['name', 'variety', 'season']);
  const formModal = useModal();
  const delModal  = useModal();
  const { canCreate, canUpdate, canDelete } = useAuth();
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleOpen = (row = null) => {
    setForm(row ? { name: row.name, variety: row.variety||'', season: row.season||'',
                    description: row.description||'', growthDurationDays: row.growthDurationDays||'' } : EMPTY);
    formModal.open(row);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Crop name is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, growthDurationDays: form.growthDurationDays || null };
      formModal.data?.id ? await cropService.update(formModal.data.id, payload) : await cropService.create(payload);
      toast.success(formModal.data?.id ? 'Crop updated!' : 'Crop created!');
      formModal.close(); refetch();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await cropService.delete(delModal.data.id);
      toast.success('Crop deleted'); delModal.close(); refetch();
    } finally { setDeleting(false); }
  };

  const cols = [
    { key: 'name',               label: 'Crop Name' },
    { key: 'variety',            label: 'Variety' },
    { key: 'season',             label: 'Season' },
    { key: 'growthDurationDays', label: 'Growth Days', render: r => r.growthDurationDays ? `${r.growthDurationDays}d` : '—' },
    { key: 'description',        label: 'Description' },
  ];

  return (
    <div className="page fade-in">
      <div className="page__header">
        <div>
          <h2 className="page__title">Crops</h2>
          <p className="page__sub">Manage crop types and varieties</p>
        </div>
        {canCreate() && (
          <button className="btn btn--primary" onClick={() => handleOpen()}>
            <MdAdd size={18}/> Add Crop
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
             title={formModal.data?.id ? 'Edit Crop' : 'Add Crop'}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <FormField label="Crop Name" required>
              <Input placeholder="e.g. Wheat" value={form.name} onChange={e => set('name', e.target.value)} />
            </FormField>
            <FormField label="Variety">
              <Input placeholder="e.g. HD-2967" value={form.variety} onChange={e => set('variety', e.target.value)} />
            </FormField>
            <FormField label="Season">
              <Select value={form.season} onChange={e => set('season', e.target.value)}>
                <option value="">Select season</option>
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </FormField>
            <FormField label="Growth Duration (days)">
              <Input type="number" placeholder="e.g. 120" value={form.growthDurationDays} onChange={e => set('growthDurationDays', e.target.value)} />
            </FormField>
          </div>
          <FormField label="Description">
            <Input placeholder="Brief description..." value={form.description} onChange={e => set('description', e.target.value)} />
          </FormField>
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={formModal.close}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving...' : (formModal.data?.id ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={delModal.isOpen} onClose={delModal.close} onConfirm={handleDelete}
        loading={deleting} title="Delete Crop" message={`Delete crop "${delModal.data?.name}"?`} />
    </div>
  );
}
