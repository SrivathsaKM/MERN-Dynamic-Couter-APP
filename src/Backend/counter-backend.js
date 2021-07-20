const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const port = 3333;

app.get('/', (req, res) => {
  res.send('Welcome');
});

// connect to db
// restart mongodb database when db server is shutdown
mongoose
  .connect('mongodb://localhost:27017/counter-fullstack', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to DB');
  })
  .catch((err) => {
    console.log('error', err);
  });

const Schema = mongoose.Schema;

const countSchema = new Schema({
  count: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model('Counter', countSchema);

//getting all counter
app.get('/api/counter', (req, res) => {
  Counter.find()
    .then((counters) => {
      res.json(counters);
    })
    .catch((error) => {
      res.json(error);
    });
});

//creating new count
app.post('/api/counter', (req, res) => {
  const counter = new Counter();
  counter.save().then((count) => {
    res.json(count).catch((err) => {
      res.json(err);
    });
  });
});

//update the existing count

app.put('/api/counter/:id', (req, res) => {
  const id = req.params.id;

  //below approach is not good
  //   Counter.findById(id)
  //     .then((counter) => {
  //       counter.count = counter.count + 1;
  //     })
  //     .save()
  //     .then((counter) => {
  //       counter.save().then((counter) => {
  //         res.json(counter);
  //       });
  //     });
  const type = req.query.type;
  let options;
  if (type === 'inc') {
    options = {
      $inc: {
        count: 1,
      },
    };
  } else if (type === 'dec') {
    options = {
      $inc: {
        count: -1,
      },
    };
  } else if (type === 'reset') {
    options = {
      $set: {
        count: 0,
      },
    };
  }

  Counter.findByIdAndUpdate(id, options, { new: true })
    .then((count) => {
      res.json(count);
    })
    .catch((err) => {
      res.json(err);
    });
});

//Api to delete
app.delete('/api/counter/:id', (req, res) => {
  const id = req.params.id;
  Counter.findByIdAndDelete(id).then((count) => {
    res.json(count).catch((err) => {
      res.json(err);
    });
  });
});

app.delete('/api/counter', (req, res) => {
  //  Counter.deleteMany({ count: { $gt: 4 } }); //  wehen count is greater than 4
  Counter.deleteMany({ count: 0 }) //when count is equal 0
    .then((count) => {
      res.json(count);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(port, () => {
  console.log('Server is listening to port', port);
});
