(function() {
    
    /* Ent Node */
    function EntNode(ent, name, path, file) {
        this._ent = ent;
        this.name = name;
        this.path = path;
        
        if (!file) {
            this.tree = [];
            this._open = false;
        }
    };

    var enp = EntNode.prototype;
    enp.toggleOpen = function() {
        this._open = !this._open;
    };

    /* Ent */
    function Ent(home) {
        if (!home) {
            home = '/';
        }
        
        this._home = home;
        this._tree = [];
        this._index = {};
        this._current = null;
        this._navigationStack = [];
    };
    
        var findNode = function(tree, nodeName) {
        for (var i = 0 ; i < tree.length ; i++) {
            var node = tree[i];
            if (nodeName == node.name) {
                return node;
            }
        }
        return null;
    };
    
    var addOnTree = function(ent, path, isFile) {
        var home = ent._home;
        var homeSplit = home == '/' ? [''] : home.split('/');

        path = path.replace(ent._home, '');
        var splitedPath = ent._splitPath(path);

        var pathHolder = [];
        pathHolder = pathHolder.concat(homeSplit);

        var tree = ent._tree;
        while (splitedPath.length) {
            var current = splitedPath[0];

            if (current) {
                pathHolder.push(current);
                var node = findNode(tree, current);
                if (node) {
                    // Node already on the tree, move on
                    tree = node.tree;
                } else {
                    var path = pathHolder.join('/');
                    // This is a file when the user is adding a file and we are at the last iteration
                    var file = (isFile && splitedPath.length == 1);
                    var node = new EntNode(ent, current, path, file);
                    ent._index[path] = node;

                    tree.push(node);
                    if (!file) {
                        tree = node.tree;
                    }
                }
            }
            splitedPath.shift();
        }
    };
    
    var p = Ent.prototype;

    p._splitPath = function(path) {
        if (path) {
            return path.split('/');
        }
        return [];
    };

    p.addFile = function(filePath) {
        addOnTree(this, filePath, true);
    };

    p.addFolder = function(folderPath) {
        addOnTree(this, folderPath, false);
    };

    p.tree = function() {
        return this._tree;
    };

    p.find = function(path) {
        return this._index[path];
    };

    p.findParent = function(path) {
        var split = path.split('/');
        split.pop();
        return this.find(split.join('/'));
    };

    p.current = function() {
        if (!this._current) {
            this._current = this._tree[0];
            this._navigationStack.push(this._current);
        }
        return this._current;
    };

    p._findMySibling = function(current, next) {
        var parent = this.findParent(current.path);
        var tree = parent ? parent.tree : this._tree;
        var pos = tree.indexOf(current);
        if (next) {
            return tree[++pos];
        } else {
            return tree[--pos];
        }
    };

    p.next = function() {
        var current = this._current;

        if (current.tree && current._open && current.tree.length) {
            this._current = current.tree[0];
        } else {
            this._current = this._findMySibling(current, true);
        }

        while (!this._current) {
            var before = this._navigationStack.pop();
            this._current = this._findMySibling(before, true);
        }

        this._navigationStack.push(this._current);

        return this._current;
    };

    p.prev = function() {
        var before = this._findMySibling(this._current, false);

        if (!before) {
            before = this.findParent(this._current.path);
        } else {
            while (before.tree && before._open && before.tree.length) {
                before = before.tree[before.tree.length - 1];
            }
        }
        this._current = before;
        this._navigationStack.pop();
        this._navigationStack.push(this._current);

        return this._current;
    };

    module.exports = Ent;
})();