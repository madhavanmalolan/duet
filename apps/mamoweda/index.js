var express = require('express');
var Task = require('./model_task');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const tasks = await Task.find({ category: { $ne: 'done' } }); 
        for(let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const createdAt = task.createdAt;
            const now = new Date();
            if(task.category == "day"){
                if(now.getDate() != createdAt.getDate()){
                    task.category = "week";
                    task.createdAt = now;
                    await task.save();
                }
            }
            if(task.category == "week"){
                if(now.getDay() == 0){
                    task.category = "month";
                    await task.save();
                }
            }
            if(task.category == "month"){
                if(now.getDate() == 1){
                    task.category = "master";
                    await task.save();
                }
            }
        }
        res.render('mamoweda/index', { title: 'Express', category: 'master', tasks: tasks, user0: process.env.USER0, user1: process.env.USER1});
    } catch (error) {
        next(error);
    }
});

router.get('/tasks/:id/category', async function(req, res, next) {
    try {
        const task = await Task.findById(req.params.id);
        task.category = req.query.val;
        await task.save();
        res.redirect('/apps/mamoweda');
    } catch (error) {
        next(error);
    }
});

router.get('/tasks/:id/delete', async function(req, res, next) {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/apps/mamoweda');
    } catch (error) {
        next(error);
    }
});

router.get('/tasks/:id/assignedTo', async function(req, res, next) {
    try {
        const task = await Task.findById(req.params.id);
        task.assignedToUser0 = !task.assignedToUser0;
        await task.save();
        res.redirect('/apps/mamoweda');
    } catch (error) {
        next(error);
    }
});

router.post('/tasks', function(req, res, next) {
    const authHeader = req.headers.authorization;
    var user = null;
    if (authHeader) {
        const [, base64Credentials] = authHeader.split(' ');
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':');
        user = username;
    }

    const task = new Task({
        title: req.body.title,
        category: 'master',
        assignedToUser0: user==process.env.USER0
    });
    task.save();
    res.redirect('/apps/mamoweda');
});

module.exports = router;
