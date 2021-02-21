const DatasetModel = require('../models/dataset').model;
const ProjectModel = require('../models/project').model;
const Model = require('../models/video').model;

async function checkAccess(ctx) {
	const project = await ProjectModel.findOne({ _id: ctx.header.project, datasets: ctx.params.datasetId });
	if (!project) {
		ctx.body = { error: 'Access denied' };
		ctx.status = 403;
		return false;
	}
	return true;
}

/**
 * get video by id
 */
async function getVideo(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = dataset.video;
	ctx.status = 200;
	return ctx;
}

/**
 * create a new video
 */
async function createVideo(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	dataset.video = new Model(ctx.request.body);
	dataset.save();
	ctx.body = dataset.video;
	ctx.status = 201;
	return ctx;
}

/**
 * update a video
 */
async function updateVideo(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	await DatasetModel.findByIdAndUpdate(
		ctx.params.datasetId,
		{ $set: { video: ctx.request.body } },
		{ new: true }
	);
	ctx.body = { message: `updated video for dataset with id: ${ctx.params.datasetId}` };
	ctx.status = 200;
	return ctx;
}

/**
 * delete  video
 */
async function deleteVideo(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.video.remove();
	await dataset.save();
	ctx.body = { message: `deleted video for dataset with id: ${ctx.params.datasetId}` };
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getVideo,
	createVideo,
	updateVideo,
	deleteVideo
};
