<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/photos/library/v1/photos_library.proto

namespace Google\Photos\Library\V1;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * Response to retrieve a list of media items.
 *
 * Generated from protobuf message <code>google.photos.library.v1.BatchGetMediaItemsResponse</code>
 */
class BatchGetMediaItemsResponse extends \Google\Protobuf\Internal\Message
{
    /**
     * [Output only] List of media items retrieved.
     * Note that even if the call to BatchGetMediaItems succeeds, there may have
     * been failures for some media items in the batch. These failures are
     * indicated in each
     * [MediaItemResult.status][google.photos.library.v1.MediaItemResult.status].
     *
     * Generated from protobuf field <code>repeated .google.photos.library.v1.MediaItemResult media_item_results = 1;</code>
     */
    private $media_item_results;

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type \Google\Photos\Library\V1\MediaItemResult[]|\Google\Protobuf\Internal\RepeatedField $media_item_results
     *           [Output only] List of media items retrieved.
     *           Note that even if the call to BatchGetMediaItems succeeds, there may have
     *           been failures for some media items in the batch. These failures are
     *           indicated in each
     *           [MediaItemResult.status][google.photos.library.v1.MediaItemResult.status].
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Google\Photos\Library\V1\PhotosLibrary::initOnce();
        parent::__construct($data);
    }

    /**
     * [Output only] List of media items retrieved.
     * Note that even if the call to BatchGetMediaItems succeeds, there may have
     * been failures for some media items in the batch. These failures are
     * indicated in each
     * [MediaItemResult.status][google.photos.library.v1.MediaItemResult.status].
     *
     * Generated from protobuf field <code>repeated .google.photos.library.v1.MediaItemResult media_item_results = 1;</code>
     * @return \Google\Protobuf\Internal\RepeatedField
     */
    public function getMediaItemResults()
    {
        return $this->media_item_results;
    }

    /**
     * [Output only] List of media items retrieved.
     * Note that even if the call to BatchGetMediaItems succeeds, there may have
     * been failures for some media items in the batch. These failures are
     * indicated in each
     * [MediaItemResult.status][google.photos.library.v1.MediaItemResult.status].
     *
     * Generated from protobuf field <code>repeated .google.photos.library.v1.MediaItemResult media_item_results = 1;</code>
     * @param \Google\Photos\Library\V1\MediaItemResult[]|\Google\Protobuf\Internal\RepeatedField $var
     * @return $this
     */
    public function setMediaItemResults($var)
    {
        $arr = GPBUtil::checkRepeatedField($var, \Google\Protobuf\Internal\GPBType::MESSAGE, \Google\Photos\Library\V1\MediaItemResult::class);
        $this->media_item_results = $arr;

        return $this;
    }

}

