const TrailerModal = ({ videoKey, onClose }) => {
  if (!videoKey) return null;
  
  return (
    <div className="modal" onClick={onClose}>
      <iframe
        src={`https://www.youtube.com/embed/${videoKey}`}
        allowFullScreen
      />
    </div>
  );
};

export default TrailerModal;
