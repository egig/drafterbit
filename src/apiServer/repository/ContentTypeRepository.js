const mysql  = require('mysql');
const BaseRespository = require('./BaseRepository');

class ContentTypeRepository extends BaseRespository {

    /**
	 * @param contentTypeId
	 * @return {Promise}
	 */
    getContentType(contentTypeId) {
        return new Promise((resolve, reject) => {

            this.connection.connect();
            let query =`
select ct.id, ct.name, ct.slug, ct.description, ctf.id as field_id, ctf.name as field_name,
  ft.name as field_type from content_type_fields as ctf
  JOIN content_types as ct on ct.id = ctf.content_type_id
  JOIN field_types as ft on ft.id = ctf.field_type_id
WHERE content_type_id=?`;

            this.connection.query(query,
                [contentTypeId],
                (error, results, fields) => {
                    if (error) return reject(error);


                    let contenType = {
                        fields: []
                    };
                    results.map(result => {
                        contenType.id = result.id;
                        contenType.name = result.name;
                        contenType.slug = result.slug;
                        contenType.description = result.description;
                        contenType.fields.push({
                            id: result.field_id,
                            name: result.field_name,
                            type: result.field_type
                        });
                    });

                    return resolve(contenType);
                });

            this.connection.end();

        });
    }


    /**
	 * @param projectId
	 * @return {Promise}
	 */
    getContentTypes(projectId) {
        return new Promise((resolve, reject) => {

            this.connection.connect();

            this.connection.query('SELECT * from content_types WHERE project_id=?',
                [projectId],
                (error, results, fields) => {
                    if (error) return reject(error);
                    return resolve(results);
                });

            this.connection.end();

        });
    }


    /**
	 *
	 * @param projectId
	 * @param slug
	 * @return {Promise}
	 */
    getContentTypeFields(projectId, slug) {
        return new Promise((resolve, reject) => {

            this.connection.connect();

            this.connection.query('SELECT id, name, slug, project_id from content_types WHERE project_id=? AND slug=?',
                [projectId, slug],
                (error, results, fields) => {
                    if (error) return reject(error);
                    if(!results.length) {
                        return resolve(null);
                    }

                    let contentType = results[0];

                    let fq = `
							SELECT
							  ctf.name,
							  ctf.label,
							  ft.id as type_id
							FROM content_type_fields as ctf
							JOIN field_types as ft on ft.id = ctf.field_type_id
							WHERE content_type_id=?`;

                    this.connection.query(fq, [contentType.id], (error, results, fields) => {

                        contentType.fields = results;
                        this.connection.end();

                        return resolve(contentType);
                    });

                });


        });
    }



    /**
	 *
	 * @param name
	 * @param slug
	 * @param description
	 * @param fields
	 * @param projectId
	 * @return {Promise}
	 */
    createContentType(name, slug, description, projectId, fields) {
        return new Promise((resolve, reject) => {

            this.connection.connect();

            this.connection.query('INSERT content_types(name, slug, description, project_id) VALUES(?,?,?,?)',
                [name, slug, description,projectId],
                (error, result, cols) => {
                    if (error) return reject(error);

                    let contentTypeId = result.insertId;

                    let values = [];
                    fields.map(f => {
                        values.push([contentTypeId, f.name, f.label, f.type]);
                    });

                    this.connection.query('INSERT INTO content_type_fields(content_type_id, name, label, field_type_id) VALUES ?',
                        [values],
						 (err, result, cols) => {
                            if (error) return reject(error);
                            this.connection.end();
                            return resolve(result);
                        }
                    );
                });

        });
    }


    /**
	 *
	 * @param contentTypeId
	 * @return {Promise}
	 */
    deleteContentType(contentTypeId) {
        return new Promise((resolve, reject) => {

            this.connection.connect();

            // TODO clean this callback hell
            this.connection.query('DELETE FROM contents WHERE content_type_id=?',
                [contentTypeId],
                (error, results, fields) => {
                    if (error) return reject(error);

                    this.connection.query('DELETE FROM content_type_fields WHERE content_type_id=?',
                        [contentTypeId],
                        (error, results, fields) => {

                            this.connection.query('DELETE FROM content_types WHERE id=?',
                                [contentTypeId],
                                (error, results, fields) => {
                                    if (error) return reject(error);
                                    this.connection.end();
                                    return resolve(results);
                                });

                        });
                });
        });
    }


    /**
	 *
	 * @param contentTypeId
	 * @param name
	 * @param slug
	 * @param description
	 * @return {Promise}
	 */
    updateContentType(contentTypeId, name, slug, description) {
        return new Promise((resolve, reject) => {

            this.connection.connect();

            this.connection.query('UPDATE content_types SET name=?, slug=?, description=? WHERE id=?',
                [name, slug, description, contentTypeId],
                (error, results, fields) => {
                    if (error) return reject(error);
                    return resolve(results);
                });

            this.connection.end();

        });
    }
}

module.exports = ContentTypeRepository;