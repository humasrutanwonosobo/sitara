export default function Loading() {
  return (
    <main className="brand-loading-screen" aria-label="Memuat SITARA">
      <div className="brand-loading-card" role="status" aria-live="polite">
        <div className="brand-loading-mark" aria-hidden="true">
          <span className="brand-loading-ring" />
          <span className="brand-loading-core">S</span>
        </div>
        <div className="brand-loading-copy">
          <p className="brand-loading-eyebrow">SITARA</p>
          <h1>Menyiapkan layanan tracking</h1>
          <p>Memuat cepat, aman, dan resmi untuk Rutan Wonosobo.</p>
        </div>
        <div className="brand-loading-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </main>
  );
}
