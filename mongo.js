const { MongoClient } = require('mongodb');

// MongoDB 连接 URL
const url = 'mongodb://host.docker.internal:27017';

// 数据库名称
const dbName = 'lighting_system';

// 异步函数，控制灯的状态
async function controlLights() {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const lightsCollection = db.collection('lights');

    // 设置灯的初始状态
    const initialResult = await lightsCollection.insertOne({ name: 'lamp', status: 'off' });
    console.log('Initial lamp status inserted:', initialResult.insertedId);

    // 打开灯
    const lampId = initialResult.insertedId;
    const openResult = await lightsCollection.updateOne(
      { _id: lampId },
      { $set: { status: 'on' } }
    );
    console.log('Lamp status updated:', openResult.modifiedCount);

    // 关闭灯
    const closeResult = await lightsCollection.updateOne(
      { _id: lampId },
      { $set: { status: 'off' } }
    );
    console.log('Lamp status updated:', closeResult.modifiedCount);

    // 查询灯状态
    const lamp = await lightsCollection.findOne({ _id: lampId });
    console.log('Current lamp status:', lamp);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // 关闭数据库连接
    client.close();
  }
}

// 调用异步函数来控制灯的状态
controlLights();