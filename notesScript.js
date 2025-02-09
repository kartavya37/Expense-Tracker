document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const notesModal = document.getElementById('notesModal');
    const notesButton = document.getElementById('notesButton');
    const closeNotesButton = notesModal.querySelector('.close-modal');
    const noteTitleInput = document.getElementById('noteTitle');
    const noteTextInput = document.getElementById('noteText');
    const saveNoteButton = document.getElementById('saveNote');
    const notesList = document.querySelector('.notes-list');

    // Initialize notes from localStorage
    let notes = JSON.parse(localStorage.getItem('expense_tracker_notes') || '[]');
    let editingNoteId = null;

    // Event Listeners with console logs for debugging
    notesButton.addEventListener('click', () => {
        console.log('notes button clicked');
        notesModal.style.display = 'block';
        renderNotes();
    });

    closeNotesButton.addEventListener('click', () => {
        console.log('close button clicked');
        notesModal.style.display = 'none';
        resetNoteForm();
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === notesModal) {
            notesModal.style.display = 'none';
            resetNoteForm();
        }
    });

    // Prevent modal close when clicking inside the modal
    notesModal.querySelector('.notes-container').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Save note event
    saveNoteButton.addEventListener('click', (e) => {
        e.preventDefault();
        saveNote();
    });

    // Function to save a note
    function saveNote() {
        const title = noteTitleInput.value.trim();
        const text = noteTextInput.value.trim();

        if (!title || !text) {
            alert('Please fill in both title and note text');
            return;
        }

        if (editingNoteId) {
            // Update existing note
            const index = notes.findIndex(note => note.id === editingNoteId);
            if (index !== -1) {
                notes[index] = {
                    ...notes[index],
                    title,
                    text,
                    lastModified: new Date().toISOString()
                };
            }
        } else {
            // Add new note
            notes.unshift({
                id: Date.now(),
                title,
                text,
                created: new Date().toISOString(),
                lastModified: new Date().toISOString()
            });
        }

        localStorage.setItem('expense_tracker_notes', JSON.stringify(notes));
        resetNoteForm();
        renderNotes();
    }

    // Function to edit a note
    function editNote(id) {
        const note = notes.find(note => note.id === id);
        if (note) {
            editingNoteId = id;
            noteTitleInput.value = note.title;
            noteTextInput.value = note.text;
            saveNoteButton.textContent = 'Update Note';
            noteTitleInput.focus();
        }
    }

    // Function to delete a note
    function deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            notes = notes.filter(note => note.id !== id);
            localStorage.setItem('expense_tracker_notes', JSON.stringify(notes));
            renderNotes();
        }
    }

    // Function to reset the note form
    function resetNoteForm() {
        editingNoteId = null;
        noteTitleInput.value = '';
        noteTextInput.value = '';
        saveNoteButton.textContent = 'Add Note';
    }

    // Function to render notes
    function renderNotes() {
        notesList.innerHTML = notes.length ? '' : '<p class="empty-notes">No notes yet</p>';
        
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note-card';
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.text}</p>
                <div class="note-card-actions">
                    <button class="edit-note" title="Edit note">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-note" title="Delete note">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Add event listeners to buttons
            noteElement.querySelector('.edit-note').addEventListener('click', () => editNote(note.id));
            noteElement.querySelector('.delete-note').addEventListener('click', () => deleteNote(note.id));

            notesList.appendChild(noteElement);
        });
    }

    // Initial render
    renderNotes();
});

// Log to verify script loading
console.log('Notes script loaded');
