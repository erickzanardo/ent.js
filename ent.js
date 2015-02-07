(function() {
    
    function EntNode(ent, name, path, file) {
        this._ent = ent;
        this.name = name;
        this.path = path;
        
        if (!file) {
            this.tree = [];
        }
    };

    function Ent(home) {
        if (!home) {
            home = '/';
        }
        
        this._home = home;
        this._tree = [];
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

    module.exports = Ent;
})();