import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { post } from '../utils/network';


const InlineReactions = ({ contentId, reaction }: { contentId: string, reaction?: boolean }) => {
  const [likeClicked, setLikeClicked] = useState(false);
  const [dislikeClicked, setDislikeClicked] = useState(false);

  const [reactionState, setReactionState] = useState(reaction);

  

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
    setReactionState(true);
  };

  const handleDislikeClick = () => {
    setDislikeClicked(true);
    setTimeout(() => setDislikeClicked(false), 300);
    handleClick(false);
    setReactionState(false);
  };

  return (
    <div className="inline-fab-container">
      {likeClicked && <div className="floating-like">
        <FontAwesomeIcon icon={faThumbsUp} />
      </div>}
      {dislikeClicked && <div className="floating-dislike">
        <FontAwesomeIcon icon={faThumbsDown} />
      </div>}
      {/* Like Button */}
      <div
        className={`inline-fab ${likeClicked ? 'clicked' : ''}`}
        onClick={handleLikeClick}
        style={{
          backgroundColor: (reactionState === true || reactionState === undefined) ? '#007bff' : 'gray',
        }}
      >
        <FontAwesomeIcon icon={faThumbsUp} />
      </div>

      {/* Dislike Button */}
      <div
        className={`inline-fab fab-dislike ${dislikeClicked ? 'clicked' : ''}`}
        onClick={handleDislikeClick}
        style={{
          backgroundColor: (reactionState === false || reactionState === undefined) ? '#dc3545' : 'gray',
        }}
      >
        <FontAwesomeIcon icon={faThumbsDown} />
      </div>
      
    </div>
  );
};

export default InlineReactions;
