import React, { useState } from 'react';
import { useApi }             from '../hooks/useApi';
import { useTable }           from '../hooks/useTable';
import { useModal }           from '../hooks/useModal';
import { cropRecordService }  from '../services/cropRecordService';
import { cropService }        from '../services/cropService';
import { fieldService }       from '../services/fieldService';
import { useAuth }            from '../context/AuthContext';
import DataTable              from '../components/common/DataTable';
import Modal                  from '../components/common/Modal';
import ConfirmDialog          from '../components/common/ConfirmDialog';
import Badge                  from '../components/common/Badge';
import FormField, { Input, Select } from '../components/common/FormField';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { formatDate, formatCurrency } from '../utils/formatUtils';
import { CROP_STATUS } from '../utils/constants';
import '../styles/pages.css';

const EMPTY = { fieldId: '', cropId: '', plantingDate: '', harvestDate: '',
                yieldKg: '', costIncurred: '', revenueGenerated: '', status: 'PLANTED' };

export default function CropRecordsPage() {
  const { data, loading, refetch } = useApi(cropRecordService.getAll);
  const { data: crops }            = useApi(cropService.getAll);
  const { data: fields }           = useApi(fieldService.getAll);
  const table     = useTable(data || [], ['cropName', 'fieldName', 'status']);
  const formModal = useModal();
  const delModal  = useModal();
  const { canCreate, canUpdate, canDelete } = useAuth();
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleOpen = (row = null) => {
    setForm(row ? {
      fieldId: row.fieldId||'', cropId: row.cropId||'',
      plantingDate: row.plantingDate||'', harvestDate: row.harvestDate||'',
      yieldKg: row.yieldKg||'', costIncurred: row.costIncurred||'',
      revenueGenerated: row.revenueGenerated||'', status: row.status||'PLANTED'
    } : EMPTY);
    formModal.open(row);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.fieldId || !form.cropId || !form.plantingDate) {
      toast.error('Field, Crop and Planting Date are required'); return;
    }
    setSaving(true);
    try {
      formModal.data?.id
        ? await cropRecordService.update(formModal.data.id, form)
        : await cropRecordService.create(form);
      toast.success('Crop record saved!');
      formModal.close(); refetch();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await cropRecordService.delete(delModal.data.id);
      toast.success('Record deleted'); delModal.close(); refetch();
    } finally { setDeleting(false); }
  };

  const cols = [
    { key: 'cropName',          label: 'Crop' },
    { key: 'fieldName',         label: 'Field' },
    { key: 'plantingDate',      label: 'Planted',   render: r => formatDate(r.plantingDate) },
    { key: 'harvestDate',       label: 'Harvested', render: r => formatDate(r.harvestDate) },
    { key: 'yieldKg',           label: 'Yield',     render: r => r.yieldKg ? `${r.yieldKg} kg` : '—' },
    { key: 'revenueGenerated',  label: 'Revenue',   render: r => formatCurrency(r.revenueGenerated) },
    { key: 'profit',            label: 'Profit',    render: r => formatCurrency(r.profit) },
    { key: 'status',            label: 'Cycle Status', render: r => <Badge status={r.status} />, sortable: false },
    { key: 'approvalStatus',    label: 'Approval',     render: r => (
      <span className={`badge badge--${r.approvalStatus?.toLowerCase() || 'pending'}`}>
        {r.approvalStatus || 'PENDING'}
      </span>
    )},
  ];

  return (
    <div className="page fade-in">
      <div className="page__header">
        <div>
          <h2 className="page__title">Crop Records</h2>
          <p className="page__sub">Track planting, harvesting and profitability</p>
        </div>
        {canCreate() && (
          <button className="btn btn--primary" onClick={() => handleOpen()}>
            <MdAdd size={18}/> Add Record
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
             title={formModal.data?.id ? 'Edit Record' : 'Add Crop Record'} size="lg">
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <FormField label="Field" required>
              <Select value={form.fieldId} onChange={e => set('fieldId', e.target.value)}>
                <option value="">Select field</option>
                {(fields||[]).map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Crop" required>
              <Select value={form.cropId} onChange={e => set('cropId', e.target.value)}>
                <option value="">Select crop</option>
                {(crops||[]).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Planting Date" required>
              <Input type="date" value={form.plantingDate} onChange={e => set('plantingDate', e.target.value)} />
            </FormField>
            <FormField label="Harvest Date">
              <Input type="date" value={form.harvestDate} onChange={e => set('harvestDate', e.target.value)} />
            </FormField>
            <FormField label="Yield (kg)">
              <Input type="number" step="0.1" placeholder="e.g. 500" value={form.yieldKg} onChange={e => set('yieldKg', e.target.value)} />
            </FormField>
            <FormField label="Status">
              <Select value={form.status} onChange={e => set('status', e.target.value)}>
                {CROP_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </FormField>
            <FormField label="Cost (₹)">
              <Input type="number" step="0.01" placeholder="e.g. 15000" value={form.costIncurred} onChange={e => set('costIncurred', e.target.value)} />
            </FormField>
            <FormField label="Revenue (₹)">
              <Input type="number" step="0.01" placeholder="e.g. 45000" value={form.revenueGenerated} onChange={e => set('revenueGenerated', e.target.value)} />
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
      <ConfirmDialog isOpen={delModal.isOpen} onClose={delModal.close} onConfirm={handleDelete}
        loading={deleting} title="Delete Record" message="Permanently delete this crop record?" />
    </div>
  );
}
