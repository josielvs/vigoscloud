const { Router } = require('express');
const path = require('path');
const { conndb } = require('../config');
const { queuesAndMembersRealtimeModel } = require('../models');
const { queuesAndMembersRealtimeController } = require('../controllers');
const { dbCallsMiddleware, authMiddleware } = require('../middlewares')

const dbCallRoute = Router();

const connRealtimeQueuesAndMembers = queuesAndMembersRealtimeModel.factory(conndb);

////////////////////////////////////////////////////// QUEUES ///////////////////////////////////////////////////////////
const createQueueRoute = queuesAndMembersRealtimeController.createQueueController(connRealtimeQueuesAndMembers);
dbCallRoute.post('/create', authMiddleware, createQueueRoute);

const readAllQueuesRoute = queuesAndMembersRealtimeController.readAllQueuesController(connRealtimeQueuesAndMembers);
dbCallRoute.get('/', authMiddleware, readAllQueuesRoute);

const readQueuesByNameRoute = queuesAndMembersRealtimeController.readQueueByNameController(connRealtimeQueuesAndMembers)
dbCallRoute.post('/name', authMiddleware, readQueuesByNameRoute);

const updateQueueRoute = queuesAndMembersRealtimeController.updateQueueController(connRealtimeQueuesAndMembers);
dbCallRoute.post('/update', authMiddleware, updateQueueRoute);

const deleteQueuesRoute = queuesAndMembersRealtimeController.deleteQueuesController(connRealtimeQueuesAndMembers);
dbCallRoute.post('/delete', authMiddleware, deleteQueuesRoute);

////////////////////////////////////////////////////// MEMBERS ///////////////////////////////////////////////////////////
const createQueueMembersRoute = queuesAndMembersRealtimeController.createMembersQueuesController(connRealtimeQueuesAndMembers);
dbCallRoute.post('/members/create', authMiddleware, createQueueMembersRoute);

const readAllMembersQueuesRoute = queuesAndMembersRealtimeController.readAllMembersQueuesController(connRealtimeQueuesAndMembers);
dbCallRoute.get('/members', authMiddleware, readAllMembersQueuesRoute);

const readQueuesMembersByNameRoute = queuesAndMembersRealtimeController.readMembersByQueueNameController(connRealtimeQueuesAndMembers);
dbCallRoute.post('/members/name', authMiddleware, readQueuesMembersByNameRoute);

const readQueuesMembersByEndpointRoute = queuesAndMembersRealtimeController.readMembersByQueueEndpointController(connRealtimeQueuesAndMembers)
dbCallRoute.post('/members/endpoint', authMiddleware, readQueuesMembersByEndpointRoute);

const deleteQueuesmembersRoute = queuesAndMembersRealtimeController.deleteMembersController(connRealtimeQueuesAndMembers);
dbCallRoute.post('/members/delete', authMiddleware, deleteQueuesmembersRoute);

module.exports = dbCallRoute;
