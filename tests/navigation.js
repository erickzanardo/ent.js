var assert = require('assert')
var Ent = require('../ent.js')

var createTreebeard = function() {
    var treebeard = new Ent('/home/treebeard');
    treebeard.addFolder('/home/treebeard/documents');
    treebeard.addFolder('/home/treebeard/emptyfolder/anotheremptyfolder/emptyfolderagain');
    treebeard.addFolder('/home/treebeard/musics');
    treebeard.addFile('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3');
    treebeard.addFile('/home/treebeard/documents/forest.doc');
    treebeard.addFile('/home/treebeard/node');
    return treebeard;
}

describe('Navigation', function() {
    it ('navigation through closed folders', function() {
        var treebeard = createTreebeard();
        var current = treebeard.current();
        // Next
        assert.equal('documents', current.name);
        current = treebeard.next();
        assert.equal('emptyfolder', current.name);
        current = treebeard.next();
        assert.equal('musics', current.name);
        current = treebeard.next();
        assert.equal('node', current.name);
        
        // Prev
        current = treebeard.prev();
        assert.equal('musics', current.name);
        current = treebeard.prev();
        assert.equal('emptyfolder', current.name);
        current = treebeard.prev();
        assert.equal('documents', current.name);
    });

    it ('navigation through open folders', function() {
        var treebeard = createTreebeard();
        treebeard.find('/home/treebeard/documents').toggleOpen();
        treebeard.find('/home/treebeard/emptyfolder').toggleOpen();
        treebeard.find('/home/treebeard/emptyfolder/anotheremptyfolder').toggleOpen();
        treebeard.find('/home/treebeard/emptyfolder/anotheremptyfolder/emptyfolderagain').toggleOpen();

        var current = treebeard.current();
        assert.equal('documents', current.name);

        // Next
        current = treebeard.next();
        assert.equal('forest.doc', current.name);
        current = treebeard.next();
        assert.equal('emptyfolder', current.name);
        current = treebeard.next();
        assert.equal('anotheremptyfolder', current.name);
        current = treebeard.next();
        assert.equal('emptyfolderagain', current.name);
        current = treebeard.next();
        assert.equal('musics', current.name);
        current = treebeard.next();
        assert.equal('node', current.name);
        
        // Prev
        current = treebeard.prev();
        assert.equal('musics', current.name);
        current = treebeard.prev();
        assert.equal('emptyfolderagain', current.name);
        current = treebeard.prev();
        assert.equal('anotheremptyfolder', current.name);
        current = treebeard.prev();
        assert.equal('emptyfolder', current.name);
        current = treebeard.prev();
        assert.equal('forest.doc', current.name);
        current = treebeard.prev();
        assert.equal('documents', current.name);
        
        
        // Test next again, just to be sure :)
        current = treebeard.next();
        assert.equal('forest.doc', current.name);
        current = treebeard.next();
        assert.equal('emptyfolder', current.name);
        current = treebeard.next();
        assert.equal('anotheremptyfolder', current.name);
        current = treebeard.next();
        assert.equal('emptyfolderagain', current.name);
        current = treebeard.next();
        assert.equal('musics', current.name);
        current = treebeard.next();
        assert.equal('node', current.name);
    });
});