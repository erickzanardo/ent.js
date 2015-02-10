var assert = require('assert')
var Ent = require('../ent.js')

describe('find nodes', function() {
    var treebeard = new Ent('/home/treebeard');
    treebeard.addFolder('/home/treebeard/documents');
    treebeard.addFolder('/home/treebeard/musics');
    treebeard.addFile('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3');
    treebeard.addFile('/home/treebeard/documents/forest.doc');
    treebeard.addFile('/home/treebeard/node');

    it('#find', function() {
        var tree = treebeard.tree();
        var node = treebeard.find('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3');
        assert.equal('Blind_Guardian_The_Lord_Of_Rings.mp3', node.name);
        assert.equal('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3', node.path);
        assert.equal(undefined, node.tree);
    });

    it('#findParent', function() {
        var tree = treebeard.tree();
        var node = treebeard.findParent('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3');
        assert.equal('musics', node.name);
        assert.equal('/home/treebeard/musics', node.path);
        assert.equal(1, node.tree.length);
    });
});