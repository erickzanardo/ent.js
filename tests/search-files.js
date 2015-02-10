var assert = require('assert')
var Ent = require('../ent.js')

describe('Search for files and folders', function() {
    var treebeard = new Ent('/home/treebeard');
    treebeard.addFolder('/home/treebeard/documents');
    treebeard.addFolder('/home/treebeard/musics');
    treebeard.addFolder('/home/treebeard/misc');
    treebeard.addFile('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3');
    treebeard.addFile('/home/treebeard/documents/forest.doc');
    treebeard.addFile('/home/treebeard/node');
    treebeard.addFile('/home/treebeard/brackets');
    
    it('#searchFiles', function() {
        var result = treebeard.searchFiles('b');
        assert.equal(2, result.length);
        assert.equal('Blind_Guardian_The_Lord_Of_Rings.mp3', result[0].name);
        assert.equal('brackets', result[1].name);
    });
});