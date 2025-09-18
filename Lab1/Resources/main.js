document.addEventListener('DOMContentLoaded', function() {
  const hoverCard = document.getElementById('member-hover-card');
  const cardImage = document.getElementById('member-card-image');
  const cardName = document.getElementById('member-card-name');
  const cardInfo = document.getElementById('member-card-info');

  // Select all member links
  const memberLinks = document.querySelectorAll('.member-link');

  memberLinks.forEach(link => {
    // Show card on hover
    link.addEventListener('mouseover', (event) => {
      // Get data from the link's data-* attributes
      const name = event.target.dataset.name;
      const image = event.target.dataset.image;
      const info = event.target.dataset.info;

      // Update the card's content
      cardName.textContent = name;
      cardImage.src = image;
      cardInfo.textContent = info;

      // Make the card visible first to measure its dimensions
      hoverCard.classList.add('visible');

      const cardWidth = hoverCard.offsetWidth;
      const cardHeight = hoverCard.offsetHeight;
      const cursorX = event.clientX;
      const cursorY = event.clientY;

      let cardX, cardY;
      const offset = 15; // The space between the cursor and the card

      // Horizontally position the card
      if (cursorX + cardWidth + offset > window.innerWidth) {
        // If it would go off-screen to the right, place it to the left of the cursor
        cardX = cursorX - cardWidth - offset;
      } else {
        cardX = cursorX + offset;
      }

      // Vertically position the card
      if (cursorY + cardHeight + offset > window.innerHeight) {
        // If it would go off-screen at the bottom, place it above the cursor
        cardY = cursorY - cardHeight - offset;
      } else {
        cardY = cursorY + offset;
      }
      
      // Apply positions
      hoverCard.style.left = `${cardX}px`;
      hoverCard.style.top = `${cardY}px`;
    });

    // Hide card when the mouse leaves
    link.addEventListener('mouseout', () => {
      hoverCard.classList.remove('visible');
    });
  });
});