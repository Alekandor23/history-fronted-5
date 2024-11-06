import { useEffect } from 'react';
import usePlayerStore from '../PlayerStore';
import './Reproductor.css';

const Reproductor = ({ onClose }) => {
  const {
    isPlaying,
    paragraphs,
    currentParagraphIndex,
    volume,
    elapsedTime,
    totalDuration,
    rate,
    togglePlay,
    handleVolumeChange,
    handleRateChange,
    setElapsedTime,
    startReadingFromParagraph,
    sintesis,
    setCurrentParagraphIndex,
    toggleMute,
    isMuted
  } = usePlayerStore();

  useEffect(() => {
    if (!paragraphs || paragraphs.length === 0 || !('speechSynthesis' in window)) {
      console.error("No hay párrafos o síntesis de voz no soportada.");
      return;
    }

    startReadingFromParagraph(currentParagraphIndex);

    const handleKeyDown = (event) => {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          handleParagraphChange('forward');
          break;
        case 'ArrowLeft':
          handleParagraphChange('backward');
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // No cancelar la síntesis de voz al desmontar el componente
    };
  }, [paragraphs, currentParagraphIndex, volume, rate]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSliderChange = (event) => {
    const newTime = parseFloat(event.target.value);
    setElapsedTime(newTime);

    sintesis.cancel();
    let cumulativeTime = 0;
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraphDuration = paragraphs[i].split(' ').length * 0.75;
      cumulativeTime += paragraphDuration;
      if (newTime <= cumulativeTime) {
        setCurrentParagraphIndex(i);
        startReadingFromParagraph(i);
        break;
      }
    }
  };

  const handleParagraphChange = (direction) => {
    const newIndex = direction === 'forward' ? currentParagraphIndex + 1 : currentParagraphIndex - 1;
    if (newIndex >= 0 && newIndex < paragraphs.length) {
      sintesis.cancel();
      setCurrentParagraphIndex(newIndex);
      startReadingFromParagraph(newIndex);
    }
  };

  const handleClose = () => {
    onClose();
    sintesis.cancel();  // Cancelar sólo al cerrar el reproductor
  };

  if (!paragraphs || paragraphs.length === 0) return null;

  return (
    <div className="player-container">
      <div className="player-header">

        <i className="bi bi-x-square" onClick={handleClose}

        title="Cerrar"
        ></i>
      </div>
      <div className="contenedor-de-controles">
        <div className="rate-control">
          <label htmlFor="rate-select" style={{ color: 'white' }}> </label>
          <select id="rate-select" value={rate} onChange={(e) => handleRateChange(parseFloat(e.target.value))}
          title="Velocidad"
          >
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="1.75">1.75x</option>
            <option value="2">2x</option>
          </select>
        </div>
        <div className="player-controls">
          <i className="bi bi-rewind" onClick={() => handleParagraphChange('backward')}
          title="Retroceder"
          ></i>
          {isPlaying ? (
            <i className="bi bi-pause" onClick={togglePlay}
            title="Pausar"
            ></i>
          ) : (
            <i className="bi bi-play-circle" onClick={togglePlay}
            title="Reproducir"
            ></i>
          )}
          <i className="bi bi-fast-forward" onClick={() => handleParagraphChange('forward')}
          title="Adelantar"
          ></i>
        </div>
        <div className="volume-control">
          <i
            className={isMuted ? "bi bi-volume-mute-fill" : "bi bi-volume-up-fill"}
            onClick={toggleMute}
            title={isMuted ? "Desactivar silenciar" : "Silenciar"}
          ></i>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            style={{ width: '100%' }}
            title="Ajustar volumen" // Etiqueta para el control de rango de volumen
          />
        </div>
      </div>
      <div className="progress-container">
        <div className="time" style={{ color: 'white' }}>
          {formatTime(elapsedTime)}
        </div>
        <input
          type="range"
          min="0"
          max={totalDuration}
          value={elapsedTime}
          onChange={handleSliderChange}
          style={{ width: '90%', margin: '0 1%' }}
          title="Ajustar progreso"
        />
        <div className="time" style={{ color: 'white' }}>
          {formatTime(totalDuration - elapsedTime)}
        </div>
      </div>
    </div>
  );
};

export default Reproductor;
