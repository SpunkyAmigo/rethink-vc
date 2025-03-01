const FileTree = {
  // Structure for storing pad relationships
  // { padId: { name: string, children: string[], parent: string | null } }
  
  init() {
    // Initialize storage if not exists
    if (!localStorage.getItem('padTree')) {
      localStorage.setItem('padTree', JSON.stringify({}));
    }
    
    // Get current pad ID
    const currentPadId = window.location.pathname.split('/').pop();
    
    // Initialize current pad if not in storage
    const tree = this.getTree();
    if (!tree[currentPadId]) {
      tree[currentPadId] = {
        name: currentPadId,
        children: [],
        parent: null
      };
      this.saveTree(tree);
    }
    
    this.renderTree();
  },

  getTree() {
    return JSON.parse(localStorage.getItem('padTree') || '{}');
  },

  saveTree(tree) {
    localStorage.setItem('padTree', JSON.stringify(tree));
  },

  createChildPad(parentPadId) {
    // Prompt for pad name
    const padName = prompt("Enter pad name:", "");
    
    // Return if user cancels or enters empty name
    if (!padName || padName.trim() === '') {
      return;
    }
    
    // Create pad ID using parent ID and sanitized name
    const sanitizedName = padName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const childPadId = `${parentPadId}-${sanitizedName}`;
    
    const tree = this.getTree();
    
    // Check if pad with this name already exists
    if (tree[childPadId]) {
      alert("A pad with this name already exists!");
      return;
    }
    
    // Add child to parent's children array
    tree[parentPadId].children.push(childPadId);
    
    // Create child pad entry
    tree[childPadId] = {
      name: padName, // Store the original name for display
      children: [],
      parent: parentPadId
    };
    
    this.saveTree(tree);
    this.renderTree();
    
    // Open the new pad
    window.open(`/p/${childPadId}`, '_blank');
  },

  renderTree() {
    const currentPadId = window.location.pathname.split('/').pop();
    const tree = this.getTree();
    const container = document.getElementById('filetree-content');
    
    // Find root pad (pad with no parent)
    let rootPad = currentPadId;
    let current = tree[currentPadId];
    while (current && current.parent) {
      rootPad = current.parent;
      current = tree[current.parent];
    }
    
    // Render tree starting from root
    container.innerHTML = this.renderNode(rootPad, tree, currentPadId);
  },

  renderNode(padId, tree, currentPadId) {
    const pad = tree[padId];
    if (!pad) return '';
    
    const isActive = padId === currentPadId;
    const activeClass = isActive ? 'bg-blue-100' : '';
    
    let html = `
      <div class="pad-node">
        <div class="flex items-center group">
          <a href="/p/${padId}" class="flex-grow block px-2 py-1 rounded ${activeClass} hover:bg-gray-100">
            <span class="text-gray-700">${pad.name}</span>
          </a>
          <button onclick="FileTree.createChildPad('${padId}')" 
                  class="invisible group-hover:visible px-2 py-1 text-gray-500 hover:text-blue-600"
                  title="Create new child pad">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
    `;
    
    if (pad.children.length > 0) {
      html += '<div class="ml-4 border-l border-gray-200">';
      for (const childId of pad.children) {
        html += this.renderNode(childId, tree, currentPadId);
      }
      html += '</div>';
    }
    
    html += '</div>';
    return html;
  }
};

// Initialize when document is ready
window.addEventListener('load', () => FileTree.init());

// Make FileTree available globally
window.FileTree = FileTree; 