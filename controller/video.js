// get model
const DatasetModel = require('../models/dataset').model;
const VideoModel = require('../models/video').model;

/**
 * get video by id
 */
async function getVideoById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		if(!dataset) {
			throw new Error();
		} else {
			if(!dataset.video) {
				ctx.body = {error: `no video found`};
				ctx.status = 404;
				return ctx;
			}
			ctx.body = dataset.video;
			ctx.status = 200;
			return ctx;
		}
	} catch (error) {
		ctx.body = {error: `no dataset found`};
		ctx.status = 404;
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
		ctx.body = dataset.video;
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
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		if(!dataset) {
			throw new Error();
		} else {
			await DatasetModel.findByIdAndUpdate(
				ctx.params.datasetId,
				{$set: {video: ctx.request.body}},
				{new: true}
			);
			ctx.body = {message: `updated video for dataset with id: ${ctx.params.datasetId}`};
			ctx.status = 200;
			return ctx;
		}
	} catch (error) {
		ctx.body = {error: `dataset with id '${ctx.params.datasetId}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * delete  video
 */
async function deleteVideo(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		await dataset.video.remove();
		await dataset.save();
		ctx.body = {message: `deleted video for dataset with id: ${ctx.params.datasetId}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `dataset with id '${ctx.params.datasetId}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

module.exports = {
	getVideoById,
	createVideo,
	updateVideo,
	deleteVideo
};
