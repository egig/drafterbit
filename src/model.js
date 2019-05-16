import mongoose from 'mongoose';
import userSchema from './user/schema/userSchema';
import contentTypeSchema from './content/schema/contentTypeSchema';
import contentSchema from './content/schema/contentSchema';
import apiKeySchema from './auth/schema/apiKeySchema';


export const User = mongoose.model('User', userSchema);
export const ContentType = mongoose.model('ContentType', contentTypeSchema);
export const Content = mongoose.model('Content', contentSchema);
export const ApiKey = mongoose.model('ApiKey', apiKeySchema);