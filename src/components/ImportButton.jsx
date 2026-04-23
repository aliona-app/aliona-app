import { LoaderCircle, Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { t } from '../i18n/ru';
import { getAcceptedTypes, importFiles } from '../utils/bookImport';

export default function ImportButton({ onImported }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  async function handleFiles(event) {
    const fileList = Array.from(event.target.files || []);
    if (!fileList.length) return;
    setBusy(true);
    setError('');
    try {
      const imported = await importFiles(fileList);
      onImported?.(imported);
    } catch (err) {
      console.error(err);
      setError(err.message || t.import.error);
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  return (
    <div className="import-block">
      <button type="button" className="primary-button primary-button--wide" onClick={() => inputRef.current?.click()} disabled={busy}>
        {busy ? <LoaderCircle size={18} className="spin" /> : <Plus size={18} />}
        {busy ? t.import.loading : t.import.button}
      </button>
      <input ref={inputRef} type="file" accept={getAcceptedTypes()} onChange={handleFiles} hidden multiple />
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
