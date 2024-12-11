exports.eejsBlock_htmlHead = function (hook_name, args, cb) {
    args.content = `
      <nav class="custom-navbar" style="
        background-color: #333;
        padding: 1rem;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      ">
        <div class="navbar-content" style="
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <a href="/" class="navbar-brand" style="
            color: white;
            text-decoration: none;
            font-size: 1.5rem;
            font-weight: bold;
          ">RethinkVC</a>
          <div class="navbar-buttons" style="
            display: flex;
            gap: 1rem;
          ">
            <button class="nav-btn" style="
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 4px;
              background-color: #4CAF50;
              color: white;
              cursor: pointer;
              font-weight: 500;
              transition: background-color 0.3s;
            ">Make Commit</button>
            <button class="nav-btn" style="
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 4px;
              background-color: #2196F3;
              color: white;
              cursor: pointer;
              font-weight: 500;
              transition: background-color 0.3s;
            ">Push</button>
          </div>
        </div>
      </nav>
      ${args.content}`;
    return cb();
  };