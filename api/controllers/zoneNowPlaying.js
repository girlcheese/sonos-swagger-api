'use strict'
const log4js = require('log4js')
const logger = log4js.getLogger('nowplaying.js')
const commonFunctions = require('../helpers/commonFunctions')
const zones = require('../helpers/zones')
const _ = require('lodash')
const playerNowPlaying = require('./playerNowPlaying')

function getZoneNowPlaying (ctx, next) {
  const discovery = ctx.request.discovery
  const zoneName = ctx.request.swagger.params.zoneName.value

  zones.areZonesDiscovered(discovery)
    .then(() => {
      return zones.isValidZone(discovery, zoneName)
    })
    .then((isValidZone) => {
      if (!isValidZone) {
        throw new Error('zone not found')
      }
      _.set(ctx.request.swagger.params, 'playerName.value', zoneName)

      return playerNowPlaying.getPlayerNowPlaying(ctx, next)
    })
    .catch((error) => {
      logger.error(error)
      if (error.message === 'zone not found') {
        const response = {
          code: 'zone.not.found',
          message: `cant find zone ${zoneName}`
        }

        return commonFunctions.sendResponse(ctx, 404, response, next)
      }

      return commonFunctions.errorHandler(ctx, error, next)
    })
}

function setZoneNowPlaying (ctx, next) {
  logger.debug(`params ${commonFunctions.returnFullObject(ctx.request.swagger.params.body.value)}`)
  const discovery = ctx.request.discovery
  const zoneName = ctx.request.swagger.params.zoneName.value

  zones.areZonesDiscovered(discovery)
    .then(() => {
      return zones.isValidZone(discovery, zoneName)
    })
    .then((isValidZone) => {
      if (!isValidZone) {
        throw new Error('zone not found')
      }
      _.set(ctx.request.swagger.params, 'playerName.value', zoneName)

      return playerNowPlaying.setPlayerNowPlaying(ctx, next)
    })
    .catch((error) => {
      logger.error(error)
      if (error.message === 'zone not found') {
        const response = {
          code: 'zone.not.found',
          message: `cant find zone ${zoneName}`
        }

        return commonFunctions.sendResponse(ctx, 404, response, next)
      }

      return commonFunctions.errorHandler(ctx, error, next)
    })
}

module.exports = {
  getZoneNowPlaying,
  setZoneNowPlaying
}
