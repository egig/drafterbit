import mongoose from 'mongoose';
import BaseRepository from '../../../repository/BaseRepository';
import Content from '../model/Content';

export default class ContentRepository extends BaseRepository {

		constructor(conn, app) {
			super(conn, app);
			this.Content = Content(conn);
		}







}