var assert = require('assert')
var Ent = require('../ent.js')

var createTreebeard = function() {
    var treebeard = new Ent();
    treebeard.addFolder('/home/treebeard/documents');
    treebeard.addFolder('/home/treebeard/emptyfolder/anotheremptyfolder/emptyfolderagain');
    treebeard.addFolder('/home/treebeard/musics');
    treebeard.addFile('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3');
    treebeard.addFile('/home/treebeard/documents/forest.doc');
    treebeard.addFile('/home/treebeard/brackets');
    return treebeard;
};

describe('Removing nodes', function() {
    describe('Removing files', function() {
        var treebeard = createTreebeard();
        treebeard.removeFile('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3');
        it('node should not be found on its parent', function() {
            var parent = treebeard.findParent('/home/treebeard/musics');
            var found = false;
            for (var i = 0; i < parent.tree.length; i++){
                if (parent.tree[i].name == 'Blind_Guardian_The_Lord_Of_Rings.mp3') {
                    found = true;
                    break;
                }
            }
            assert.equal(false, found);
        });
        
        it('node should not be found', function() {
            var tree = treebeard.tree();
            var node = treebeard.find('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3');
            assert.equal(null, node);
        });
        it('node should not be found in the file list', function() {
            var result = treebeard.searchFiles('b');
            assert.equal(1, result.length);
            assert.equal('brackets', result[0].name);
        });
    });

    describe('Removing folders', function() {
        var treebeard = createTreebeard();
        treebeard.removeFolder('/home/treebeard/musics');

        it('node should not be found on its parent', function() {
            var parent = treebeard.findParent('/home/treebeard');
            var found = false;
            for (var i = 0; i < parent.tree.length; i++){
                if (parent.tree[i].name == 'music') {
                    found = true;
                    break;
                }
            }
            assert.equal(false, found);
        });
        
        it('folder and its nodes should not be found', function() {
            var tree = treebeard.tree();
            var node = treebeard.find('/home/treebeard/musics');
            assert.equal(null, node);
            node = treebeard.find('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3');
            assert.equal(null, node);
        });
        it('node of the folder should not be found in the file list', function() {
            var result = treebeard.searchFiles('b');
            assert.equal(1, result.length);
            assert.equal('brackets', result[0].name);
        });
    });

    describe('Removing itens on the root', function() {
        var treebeard = new Ent('/home/treebeard');
        treebeard.addFolder('/home/treebeard/documents');
        treebeard.addFile('/home/treebeard/brackets');

        treebeard.removeFile('/home/treebeard/brackets');
        it('node must have been removed', function() {
            assert.equal(1, treebeard.tree().length);
        });
    });
});