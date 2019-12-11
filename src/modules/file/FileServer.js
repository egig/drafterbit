const fs = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');

class FileServer {

    constructor(basePath) {
        this.basePath = basePath;
    }

    preparePath(q_path) {
        return path.join(this.basePath, q_path);
    }

    static  makeRelativePath(path, base) {
        return path.replace(base, '').trimLeft('/');
    }

    handleUpload (request, response) {

        let q_path = request.body.path;
        let reqx_path = this.preparePath(q_path);

        let json_response = [];
        for(let i=0; i<request.files.length; i++) {

            let tmp_path = request.files[i].path;

            // The original name of the uploaded file
            // is stored in the letiable "originalname".
            let name = request.files[i].originalname;
            let target_path = reqx_path+'/' + request.files[i].originalname;

            let src = fs.createReadStream(tmp_path);
            let dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            json_response.push({uploaded: name});

            // @todo
            // src.on('end', function() { res.render('complete'); });
            /// src.on('error', function(err) { res.render('error'); });
        }

        response.json(json_response);
    }

    handle (request, response) {

        let op = request.query.op;
        let q_path = request.query.path;

        if( typeof op == 'undefined') {
            op = request.body.op;
        }

        let jsonResponse;
        let dest;
        switch (op) {
        case 'ls':
            jsonResponse = this.ls(q_path);
            break;
        case 'properties':
            jsonResponse = this.properties(q_path);
            break;
        case 'mkdir':
            let folder_name = request.body['folder-name'];
            q_path = request.body.path;

            jsonResponse = this.mkdir(q_path, folder_name);
            break;
        case 'delete':
            q_path = request.body.path;
            jsonResponse = this.delete(q_path);
            break;
        case 'rename':
            q_path = request.body.path;
            let new_name = request.body.newName;
            jsonResponse = this.rename(q_path, new_name);
            break;
        case 'copy':
            q_path = request.body.path;
            dest = request.body.dest;

            jsonResponse = this.copy(q_path, dest);

            break;
        case 'cut':
            q_path = request.body.path;
            dest = request.body.dest;

            jsonResponse = this.cut(q_path, dest);

            break;
        default:
            jsonResponse = {error: 'Unknown op'};
            break;
        }

        response.json(jsonResponse);
    }

    copy(q_path, dest) {
        let reqx_path = this.preparePath(q_path);
        let req_dest = this.preparePath(dest);

        let p_stat = fs.lstatSync(req_dest);
        if(p_stat.isFile()) {
            console.log('Cannot override file');
            return false;
        }

        let bname = path.basename(reqx_path);
        if(p_stat.isDirectory()) {
            req_dest = path.join(req_dest, bname);
        }

        fs.copy(reqx_path, req_dest, function(err) {
            if(err) console.log(err);
        });

        return [];
    }

    cut(q_path, dest) {
        let reqx_path = this.preparePath(q_path);
        let req_dest = this.preparePath(dest);

        let p_stat = fs.lstatSync(req_dest);
        if(p_stat.isFile()) {
            console.log('Cannot override file');
            return false;
        }

        let bname = path.basename(reqx_path);
        if(p_stat.isDirectory()) {
            req_dest = path.join(req_dest, bname);
        }

        fs.move(reqx_path, req_dest, function(err) {
            if(err) console.log(err);
        });

        return [];
    }

    rename(q_path, new_name) {

        let reqx_path = this.preparePath(q_path);

        let dirname = path.dirname(reqx_path);

        let new_path = path.join(dirname, new_name);

        fs.rename(reqx_path, new_path);

        return [];
    }

    delete(q_path) {
        let reqx_path = this.preparePath(q_path);

        rimraf(reqx_path, function(err) { });

        return {};
    }

    mkdir(q_path, folder_name) {
        let reqx_path = this.preparePath(q_path);
        let full_path = path.join(reqx_path, folder_name);

        fs.mkdir(full_path);

        return {
            type: 'dir',
            path: path.join(q_path, folder_name),
        };
    }

    properties(q_path) {

        let reqx_path = this.preparePath(q_path);
        let p_stat = fs.lstatSync(reqx_path);
        return {
            name: q_path,
            size: p_stat.size,
            type: q_path.isFile ? 'File' : 'Directory',
            location: path.dirname(reqx_path)
        };
    }

    ls(q_path) {

        let reqx_path = this.preparePath(q_path);

        let data = fs.readdirSync(reqx_path);

        let array_data = [];
        for(let i=0;i<data.length;i++) {

            let full_path = path.join(reqx_path, data[i]);
            let p = FileServer.makeRelativePath(full_path, reqx_path);
            let p_stat = fs.lstatSync(full_path);

            let file = {
                type: p_stat.isFile() ? 'file' : 'dir',
                path: path.join(q_path, p),
                text: data[i],
            };

            array_data.push(file);
        }

        return array_data;
    }
}

module.exports = FileServer;
