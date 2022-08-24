
async function commentFormHandler(event){
    event.preventDefault();
    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();
    // use the current URL to extract the post id value by splitting
    // the array by '/' and then getting the length minus 1
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    
    // so, if there's some text in the text area when the 'add comment'
    // button is clicked, then fetch POST method below
    if (comment_text) {
        const response = await fetch('/api/comments', {
          method: 'POST',
          body: JSON.stringify({
            post_id,
            comment_text
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      
        if (response.ok) {
          document.location.reload();
        } else {
          alert(response.statusText);
        }
      }
}

// on single-post.handlebars, add the event listener to the comment form
document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);