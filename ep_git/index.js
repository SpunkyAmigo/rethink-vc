exports.eejsBlock_htmlHead = function (hook_name, args, cb) {
    args.content = `
      <nav class="custom-navbar">
        <div class="navbar-content">
          <a href="/" class="navbar-brand">RethinkVC</a>
          <div class="navbar-buttons">
            <button class="nav-btn">Make Commit</button>
            <button class="nav-btn">Push</button>
          </div>
        </div>
      </nav>
      ${args.content}`;
    return cb();
  };