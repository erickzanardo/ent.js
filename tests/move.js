var assert = require('assert')
var Ent = require('../ent.js')

var createTreebeard = function() {
    var treebeard = new Ent('/home/treebeard');
    treebeard.addFolder('/home/treebeard/documents');
    treebeard.addFolder('/home/treebeard/emptyfolder/anotheremptyfolder/emptyfolderagain');
    treebeard.addFolder('/home/treebeard/musics');
    treebeard.addFolder('/home/treebeard/old_musics');
    treebeard.addFile('/home/treebeard/old_musics/folk/Bards_song.mp3');
    treebeard.addFile('/home/treebeard/old_musics/metal/War_Pigs.mp3');
    treebeard.addFile('/home/treebeard/musics/Blind_Guardian_The_Lord_Of_Rings.mp3');
    treebeard.addFile('/home/treebeard/documents/forest.doc');
    treebeard.addFile('/home/treebeard/node');
    return treebeard;
}

describe('Move funtions', function() {
    describe('Moving a folder to another folder on root', function() {
        var treebeard = createTreebeard();

        treebeard.move('/home/treebeard/old_musics', '/home/treebeard/musics');
        
        it('root must have one less node', function() {
            assert.equal(4, treebeard.tree().length);
        });

        it('/home/treebeard/old_musics must be no more', function() {
            assert.equal(null, treebeard.find('/home/treebeard/old_musics'));
        });
        
        it('old_musics must be under /home/treebeard/musics', function() {
            var node = treebeard.find('/home/treebeard/musics/old_musics');
            assert.equal('old_musics', node.name);
        });
        
        var tree = treebeard.find('/home/treebeard/musics').tree;
        it('musics must have two nodes now', function() {
            assert.equal(2, tree.length);
        });

        it('Tree of the old_musics should be the same', function() {
            var node = treebeard.find('/home/treebeard/musics/old_musics');

            assert.equal('old_musics', node.name);
            assert.equal(2, node.tree.length);

            var innerFolder = node.tree[0]
            assert.equal('folk', innerFolder.name);
            assert.equal(1, innerFolder.tree.length);

            innerFolder = node.tree[1]
            assert.equal('metal', innerFolder.name);
            assert.equal(1, innerFolder.tree.length);
        });
    });

    describe('Rename a folder', function() {
        var treebeard = createTreebeard();

        treebeard.move('/home/treebeard/old_musics', '/home/treebeard/great_musics');
        
        it('root must not be changed', function() {
            assert.equal(5, treebeard.tree().length);
        });

        it('old_musics must be no more', function() {
            assert.equal(null, treebeard.find('/home/treebeard/old_musics'));
        });

        var tree = treebeard.find('/home/treebeard/great_musics').tree;
        
        it('Tree of the old_musics should be the same', function() {
            assert.equal(2, tree.length);

            var innerFolder = tree[0]
            assert.equal('folk', innerFolder.name);
            assert.equal(1, innerFolder.tree.length);

            innerFolder = tree[1]
            assert.equal('metal', innerFolder.name);
            assert.equal(1, innerFolder.tree.length);
        });
    });
    
    describe('Move a file', function() {
        var treebeard = createTreebeard();
        treebeard.move('/home/treebeard/old_musics/folk/Bards_song.mp3', '/home/treebeard/musics');

        it('Bards song must be moved to musics and folk must be empty', function() {
            var musics = treebeard.find('/home/treebeard/musics');
            assert.equal(2, musics.tree.length);
            assert.equal('Bards_song.mp3', musics.tree[1].name);

            var folk = treebeard.find('/home/treebeard/old_musics/folk');
            assert.equal(0, folk.tree.length);
        });
    });
    
    describe('Rename a file', function() {
        var treebeard = createTreebeard();
        treebeard.move('/home/treebeard/old_musics/folk/Bards_song.mp3', '/home/treebeard/old_musics/folk/bs.mp3');

        it('file must be renamed', function() {
            assert.equal(null, treebeard.find('/home/treebeard/old_musics/folk/Bards_song.mp3'));
            assert.equal('bs.mp3', treebeard.find('/home/treebeard/old_musics/folk/bs.mp3').name);
        });
    });

    describe('Searches', function() {
        describe('find a renamed file', function() {
            var treebeard = createTreebeard();
            treebeard.move('/home/treebeard/old_musics/folk/Bards_song.mp3', '/home/treebeard/old_musics/folk/bs.mp3');

            var result = treebeard.searchFiles('b');
            it('Bards_song.mp3 should not be in the result', function() {
                assert.equal(2, result.length);
                assert.equal('bs.mp3', result[0].name);
                assert.equal('/home/treebeard/old_musics/folk/bs.mp3', result[0].path);
                assert.equal('Blind_Guardian_The_Lord_Of_Rings.mp3', result[1].name);
            });
        });

        describe('find a moved file', function() {
            var treebeard = createTreebeard();
            treebeard.move('/home/treebeard/old_musics/folk/Bards_song.mp3', '/home/treebeard/old_musics');

            var result = treebeard.searchFiles('b');
            it('Bards_song.mp3 must have another path', function() {
                assert.equal(2, result.length);
                assert.equal('Bards_song.mp3', result[0].name);
                assert.equal('/home/treebeard/old_musics/Bards_song.mp3', result[0].path);
                assert.equal('Blind_Guardian_The_Lord_Of_Rings.mp3', result[1].name);
            });
        });
    });
});