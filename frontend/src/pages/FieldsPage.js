import React, { useState } from 'react';
import { useApi }       from '../hooks/useApi';
import { useTable }     from '../hooks/useTable';
import { useModal }     from '../hooks/useModal';
import { fieldService } from '../services/fieldService';
import { farmerService }from '../services/farmerService';
import { useAuth }      from '../context/AuthContext';
import DataTable        from '../components/common/DataTable';
import Modal            from '../components/common/Modal';
import ConfirmDialog    from '../components/common/ConfirmDialog';
import FormField, { Input, Select } from '../components/common/FormField';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { SOIL_TYPES } from '../utils/constants';
import '../styles/pages.css';

const EMPTY = { name: '', areaInAcres: '', location: '', soilType: '', farmerId: '' };

export default function FieldsPage() {
  const { data, loading, refetch } = useApi(fieldService.getAll);
  const { data: farmers }          = useApi(farmerService.getAll);
  const table     = useTable(data || [], ['name', 'location', 'farmerName']);
  const formModal = useModal();
  const delModal  = useModal();
  const { canCreate, canUpdate, canDelete } = useAuth();
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleOpen = (row = null) => {
    setForm(row ? { name: row.name, areaInAcres: row.areaInAcres||'', location: row.location||'',
                    soilType: row.soilType||'', farmerId: row.farmerId||'' } : EMPTY);
    formModal.open(row);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.farmerId) { toast.error('Name and Farmer are required'); return; }
    setSaving(true);
    try {
      formModal.data?.id
        ? await fieldService.update(formModal.data.id, form)
        : await fieldService.create(form);
      toast.success(formModal.data?.id ? 'Field updated!' : 'Field created!');
      formModal.close(); refetch();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fieldService.delete(delModal.data.id);
      toast.success('Field deleted'); delModal.close(); refetch();
    } finally { setDeleting(false); }
  };

  const cols = [
    { key: 'name',         label: 'Field Name' },
    { key: 'farmerName',   label: 'Farmer' },
    { key: 'areaInAcres',  label: 'Area (acres)', render: r => r.areaInAcres ? `${r.areaInAcres} ac` : '—' },
    { key: 'location',     label: 'Location' },
    { key: 'soilType',     label: 'Soil Type' },
  ];

  return (
    <div className="page fade-in">
      <div className="page__header">
        <div>
          <h2 className="page__title">Fields</h2>
          <p className="page__sub">Manage farm fields and land parcels</p>
        </div>
        {canCreate() && (
          <button className="btn btn--primary" onClick={() => handleOpen()}>
            <MdAdd size={18}/> Add Field
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
             title={formModal.data?.id ? 'Edit Field' : 'Add Field'}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <FormField label="Field Name" required>
              <Input placeholder="North Block A" value={form.name} onChange={e => set('name', e.target.value)} />
            </FormField>
            <FormField label="Farmer" required>
              <Select value={form.farmerId} onChange={e => set('farmerId', e.target.value)}>
                <option value="">Select farmer</option>
                {(farmers||[]).map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Area (acres)">
              <Input type="number" step="0.01" placeholder="e.g. 2.5" value={form.areaInAcres} onChange={e => set('areaInAcres', e.target.value)} />
            </FormField>
            <FormField label="Soil Type">
              <Select value={form.soilType} onChange={e => set('soilType', e.target.value)}>
                <option value="">Select soil type</option>
                {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </FormField>
          </div>
          <FormField label="Location">
            <Input placeholder="Village, Tehsil, District" value={form.location} onChange={e => set('location', e.target.value)} />
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
        loading={deleting} title="Delete Field" message={`Delete field "${delModal.data?.name}"?`} />
    </div>
  );
}
