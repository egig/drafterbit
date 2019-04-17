import mongoose from 'mongoose';
import userSchema from './schema/userSchema';
import contentTypeSchema from './schema/contentTypeSchema';
import contentSchema from './schema/contentSchema';
import apiKeySchema from './schema/apiKeySchema';


export const User = mongoose.model('User', userSchema);
export const ContentType = mongoose.model('ContentType', contentTypeSchema);
export const Content = mongoose.model('Content', contentSchema);
export const ApiKey = mongoose.model('ApiKey', apiKeySchema);