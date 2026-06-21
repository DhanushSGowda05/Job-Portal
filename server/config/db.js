import mongoose from "mongoose";

//connect function

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('database connected'))

    const uri = process.env.MONGODB_URI;

    // Insert the database name before any existing query string (?...),
    // instead of naively appending it at the very end of the URI.
    // This avoids breaking things like ?retryWrites=true&appName=Cluster0
    const [baseUri, queryString] = uri.split('?');
    const cleanBase = baseUri.endsWith('/') ? baseUri.slice(0, -1) : baseUri;
    const finalUri = queryString
        ? `${cleanBase}/test?${queryString}`
        : `${cleanBase}/test`;

    await mongoose.connect(finalUri);
}

export default connectDB