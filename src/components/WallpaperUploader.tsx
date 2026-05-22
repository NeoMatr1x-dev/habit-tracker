import type { WallpaperAsset } from '../types';

type WallpaperUploaderProps = {
  asset: WallpaperAsset | null;
  onUpload: (file: File) => void;
  onClear: () => void;
};

export default function WallpaperUploader({ asset, onUpload, onClear }: WallpaperUploaderProps) {
  return (
    <div className="card">
      <h2 className="card-title">Live wallpaper</h2>
      <p className="notice">Upload an image or a short video to customize your background.</p>
      <div className="form-row">
        <label className="label" htmlFor="wallpaper-upload">
          Choose image or video
        </label>
        <input
          id="wallpaper-upload"
          className="input"
          type="file"
          accept="image/*,video/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
          }}
        />
      </div>
      {asset ? (
        <div className="asset-preview">
          <div className="preview-panel">
            {asset.type === 'video' ? (
              <video src={asset.url} autoPlay muted loop playsInline />
            ) : (
              <img src={asset.url} alt={asset.name} />
            )}
            <div className="preview-overlay" />
          </div>
          <div className="actions">
            <button className="button secondary-button" type="button" onClick={onClear}>
              Remove wallpaper
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
