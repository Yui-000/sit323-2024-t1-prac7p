const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// 使用环境变量中的连接字符串
const mongoURI = process.env.MONGO_URI;

// 添加性能监控中间件
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Schema & Model
const Item = mongoose.model('Item', new mongoose.Schema({ 
  name: String,
  createdAt: { type: Date, default: Date.now }
}));

// Routes
app.post('/items', async (req, res) => {
  try {
    const item = new Item({ name: req.body.name });
    await item.save();
    console.log(`Created new item: ${item._id}`);
    res.send(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).send({ error: error.message });
  }
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    console.log(`Retrieved ${items.length} items`);
    res.send(items);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).send({ error: error.message });
  }
});

// 获取单个项目
app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      console.log(`Item not found: ${req.params.id}`);
      return res.status(404).send({ error: 'Item not found' });
    }
    console.log(`Retrieved item: ${item._id}`);
    res.send(item);
  } catch (error) {
    console.error('Error retrieving item:', error);
    res.status(500).send({ error: error.message });
  }
});

// 更新项目
app.put('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    if (!item) {
      console.log(`Item not found for update: ${req.params.id}`);
      return res.status(404).send({ error: 'Item not found' });
    }
    console.log(`Updated item: ${item._id}`);
    res.send(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).send({ error: error.message });
  }
});

// 删除项目
app.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      console.log(`Item not found for deletion: ${req.params.id}`);
      return res.status(404).send({ error: 'Item not found' });
    }
    console.log(`Deleted item: ${req.params.id}`);
    res.send({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send({ error: error.message });
  }
});

// 健康检查端点
app.get('/health', (req, res) => {
  const health = {
    status: 'UP',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  res.send(health);
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
