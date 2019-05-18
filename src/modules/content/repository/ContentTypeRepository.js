import mongoose from 'mongoose';
import ContentType from '../model/ContentType';
import BaseRepository from '../../../repository/BaseRepository';

export default class ContentTypeRepository extends BaseRepository {

	constructor(conn, app) {
		super(conn, app);
		this.ContentType = ContentType(conn)
	}

}