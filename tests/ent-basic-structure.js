var assert = require('assert')
var Ent = require('../ent.js')

var assertTree = function(tree) {
}

describe('Ent basic structure', function() {
    describe('Simple hierarchy', function() {
        var treebeard = new Ent();
        treebeard.addFolder('/home/treebeard/documents');
        treebeard.addFolder('/home/treebeard/musics');
        treebeard.addFile('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3');
        treebeard.addFile('/home/treebeard/documents/forest.doc');
        treebeard.addFile('/home/treebeard/node');
        it('Tree must be created correctly', function() {
            var tree = treebeard.tree();

            assert.equal(1, tree.length);
            var home = tree[0];
            assert.equal('home', home.name);
            assert.equal('/home', home.path);
            assert.equal(1, home.tree.length);

            var treebeard_folder = home.tree[0];
            assert.equal('treebeard', treebeard_folder.name);
            assert.equal('/home/treebeard', treebeard_folder.path);
            assert.equal(3, treebeard_folder.tree.length);

            var documents = treebeard_folder.tree[0];
            assert.equal('documents', documents.name);
            assert.equal('/home/treebeard/documents', documents.path);
            assert.equal(1, documents.tree.length);

            var forest_doc = documents.tree[0];
            assert.equal('forest.doc', forest_doc.name);
            assert.equal('/home/treebeard/documents/forest.doc', forest_doc.path);
            assert.equal(undefined, forest_doc.tree);

            var musics = treebeard_folder.tree[1];
            assert.equal('musics', musics.name);
            assert.equal(1, musics.tree.length);

            var music = musics.tree[0];
            assert.equal('Blind_Guardian_The_Lord_Of_Rings.mp3', music.name);
            assert.equal('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3', music.path);
            assert.equal(undefined, music.tree);

            var node = treebeard_folder.tree[2];
            assert.equal('node', node.name);
            assert.equal('/home/treebeard/node', node.path);
            assert.equal(undefined, node.tree);
        });
    });

    describe('With home hierarchy', function() {
        var treebeard = new Ent('/home/treebeard');
        treebeard.addFolder('/home/treebeard/documents');
        treebeard.addFolder('/home/treebeard/musics');
        treebeard.addFile('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3');
        treebeard.addFile('/home/treebeard/documents/forest.doc');
        treebeard.addFile('/home/treebeard/node');
        it('Tree must be created correctly', function() {
            var tree = treebeard.tree();
            assert.equal(3, tree.length);

            var documents = tree[0];
            assert.equal('documents', documents.name);
            assert.equal('/home/treebeard/documents', documents.path);
            assert.equal(1, documents.tree.length);

            var forest_doc = documents.tree[0];
            assert.equal('forest.doc', forest_doc.name);
            assert.equal('/home/treebeard/documents/forest.doc', forest_doc.path);
            assert.equal(undefined, forest_doc.tree);

            var musics = tree[1];
            assert.equal('musics', musics.name);
            assert.equal(1, musics.tree.length);

            var music = musics.tree[0];
            assert.equal('Blind_Guardian_The_Lord_Of_Rings.mp3', music.name);
            assert.equal('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3', music.path);
            assert.equal(undefined, music.tree);

            var node = tree[2];
            assert.equal('node', node.name);
            assert.equal('/home/treebeard/node', node.path);
            assert.equal(undefined, node.tree);
        });
    });
});