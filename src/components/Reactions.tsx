import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { post } from '../utils/network';


const Reactions = () => {
  const [likeClicked, setLikeClicked] = useState(false);
  const [dislikeClicked, setDislikeClicked] = useState(false);

  const { contentId } = useParams<{ contentId: string }>();

  const handleClick = (reaction: boolean) => {
    post(`/contents/${contentId}/reactions`, {
      isSatisfied: reaction,
    });
  };

  // Función para activar la animación y reiniciarla
  const handleLikeClick = () => {
    setLikeClicked(true);
    setTimeout(() => setLikeClicked(false), 300); // Resetear después de 300ms
    handleClick(true);
  };

  const handleDislikeClick = () => {
    setDislikeClicked(true);
    setTimeout(() => setDislikeClicked(false), 300);
    handleClick(false);
  };

  return (
    <div className="fab-container">
      {likeClicked && <div className="floating-like">
        <FontAwesomeIcon icon={faThumbsUp} />
      </div>}
      {dislikeClicked && <div className="floating-dislike">
        <FontAwesomeIcon icon={faThumbsDown} />
      </div>}
      {/* Like Button */}
      <div
        className={`fab ${likeClicked ? 'clicked' : ''}`}
        onClick={handleLikeClick}
      >
        <FontAwesomeIcon icon={faThumbsUp} />
      </div>

      {/* Dislike Button */}
      <div
        className={`fab fab-dislike ${dislikeClicked ? 'clicked' : ''}`}
        onClick={handleDislikeClick}
      >
        <FontAwesomeIcon icon={faThumbsDown} />
      </div>
      
    </div>
  );
};

export default Reactions;
