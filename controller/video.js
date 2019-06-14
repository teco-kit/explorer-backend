// get model
const DatasetModel = require('../models/dataset').model;
const VideoModel = require('../models/video').model;

/**
 * get video by id
 */
async function getVideoById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		ctx.body = {data: dataset.video};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * create a new video
 */
async function createVideo(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		dataset.video = new VideoModel(ctx.request.body);
		dataset.save();
		ctx.body = {data: dataset.video};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * update a video
 */
async function updateVideo(ctx) {
	try {
		const dataset = await DatasetModel.findByIdAndUpdate(
			ctx.params.datasetId,
			{$set: {video: ctx.request.body}},
			{new: true}
		);
		ctx.body = {
			data: dataset.video,
			message: `updated video for dataset with id: ${ctx.params.datasetId}`
		};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete  video
 */
async function deleteVideo(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		dataset.video.remove().save();
		ctx.body = {message: `deleted video type with id: ${ctx.params.datasetId}`};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

module.exports = {
	getVideoById,
	createVideo,
	updateVideo,
	deleteVideo
};
