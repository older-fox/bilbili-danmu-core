-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2021-03-07 23:57:39
-- 服务器版本： 5.7.31-log
-- PHP 版本： 7.3.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `stream`
--

-- --------------------------------------------------------

--
-- 表的结构 `anchor_info`
--

CREATE TABLE `anchor_info` (
  `Id` bigint(20) NOT NULL,
  `anchor_id` bigint(30) NOT NULL COMMENT '抽奖编号',
  `require_text` varchar(100) DEFAULT NULL COMMENT '需求文本',
  `award_name` varchar(128) DEFAULT NULL COMMENT '天选奖励文本',
  `gift_name` varchar(50) DEFAULT NULL COMMENT '天选需要的礼物信息',
  `danmu` varchar(100) DEFAULT NULL COMMENT '领奖需要发送的弹幕',
  `start_time` int(11) DEFAULT NULL COMMENT '抽奖发起日期'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='天选之人抽奖信息';

-- --------------------------------------------------------

--
-- 表的结构 `daily_gift_info`
--

CREATE TABLE `daily_gift_info` (
  `uid` bigint(20) NOT NULL COMMENT '观众uid',
  `username` varchar(50) DEFAULT NULL COMMENT '用户昵称',
  `gift_count` int(11) NOT NULL DEFAULT '0' COMMENT '礼物计数',
  `silver_count` bigint(20) DEFAULT '0' COMMENT '银瓜子计数',
  `gold_count` bigint(20) DEFAULT '0' COMMENT '金瓜子计数',
  `biggest_gift` bigint(11) DEFAULT '0' COMMENT '最高价值的礼物价格',
  `biggest_gift_name` varchar(20) DEFAULT NULL COMMENT '最高价值的礼物的名称',
  `biggest_gift_count` int(11) DEFAULT '0' COMMENT '最高价值的礼物的赠送数量',
  `record_date` varchar(30) NOT NULL COMMENT '统计日期'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='每日礼物记录';

-- --------------------------------------------------------

--
-- 表的结构 `daily_viewers_info`
--

CREATE TABLE `daily_viewers_info` (
  `uid` bigint(20) NOT NULL COMMENT '观众uid',
  `username` varchar(50) DEFAULT '' COMMENT '用户昵称',
  `entry_times` bigint(20) DEFAULT '0' COMMENT '进入次数',
  `danmu_count` bigint(20) DEFAULT '0' COMMENT '弹幕发送计数',
  `gift_count` bigint(20) DEFAULT NULL COMMENT '礼物赠送数量',
  `laste_activety` varchar(50) DEFAULT '' COMMENT '最后活动行为',
  `record_date` varchar(30) NOT NULL COMMENT '记录日期'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='观众总表';

-- --------------------------------------------------------

--
-- 表的结构 `danmu_info`
--

CREATE TABLE `danmu_info` (
  `Id` bigint(20) NOT NULL,
  `uid` bigint(20) NOT NULL DEFAULT '0' COMMENT '观众Uid',
  `username` varchar(50) DEFAULT '' COMMENT '观众用户名',
  `title_id` int(11) DEFAULT NULL COMMENT '勋章对应的主播直播间',
  `ul_level` int(11) DEFAULT NULL COMMENT '用户UL等级',
  `rank_level` int(11) DEFAULT NULL COMMENT '用户等级排名',
  `message` varchar(255) DEFAULT '' COMMENT '弹幕内容',
  `upload_time` int(11) DEFAULT NULL COMMENT '弹幕发送时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='弹幕存储库';

-- --------------------------------------------------------

--
-- 表的结构 `entry_info`
--

CREATE TABLE `entry_info` (
  `Id` bigint(20) NOT NULL,
  `uid` bigint(20) NOT NULL DEFAULT '0' COMMENT '观众uid',
  `username` varchar(50) DEFAULT '' COMMENT '观众昵称',
  `entry_time` int(11) DEFAULT NULL COMMENT '进入时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房间进入日志';

-- --------------------------------------------------------

--
-- 表的结构 `full_time_record`
--

CREATE TABLE `full_time_record` (
  `Id` int(11) NOT NULL,
  `fllower_count` int(11) DEFAULT '0' COMMENT '全局粉丝记录',
  `viewer_count` int(11) DEFAULT NULL COMMENT '全局观众记录',
  `upload_time` bigint(20) DEFAULT NULL COMMENT '记录时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='全局关注及观众统计';

-- --------------------------------------------------------

--
-- 表的结构 `gift_history`
--

CREATE TABLE `gift_history` (
  `Id` bigint(20) NOT NULL,
  `uid` bigint(20) NOT NULL DEFAULT '0' COMMENT '观众uid',
  `username` varchar(50) DEFAULT '' COMMENT '观众昵称',
  `send_time` int(11) DEFAULT '0' COMMENT '发送时间',
  `sent_count` int(11) DEFAULT '0' COMMENT '发送数量',
  `coin_type` varchar(50) DEFAULT '' COMMENT '花费的瓜子类型',
  `coin_count` int(11) DEFAULT '0' COMMENT '花费的瓜子数量',
  `gift_id` int(11) DEFAULT '0' COMMENT '礼物ID',
  `action` varchar(50) DEFAULT '' COMMENT '操作类型',
  `gift_name` varchar(100) DEFAULT '' COMMENT '礼物名称'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='礼物发送历史';

-- --------------------------------------------------------

--
-- 表的结构 `gift_info`
--

CREATE TABLE `gift_info` (
  `uid` bigint(20) NOT NULL DEFAULT '0' COMMENT '观众uid',
  `username` varchar(50) DEFAULT '' COMMENT '用户昵称',
  `gift_count` int(11) DEFAULT '0' COMMENT '礼物计数',
  `silver_count` bigint(20) DEFAULT '0' COMMENT '银瓜子计数',
  `gold_count` bigint(20) DEFAULT '0' COMMENT '金瓜子计数',
  `biggest_gift` int(11) DEFAULT '0' COMMENT '历史赠送最高价值',
  `biggest_gift_name` varchar(50) DEFAULT '' COMMENT '最高价值的礼物的名称',
  `biggest_gift_count` int(11) DEFAULT '0' COMMENT '记录刷新时赠送的数量',
  `update_time` int(11) DEFAULT '0' COMMENT '条目更新时间',
  `record_update_time` int(11) NOT NULL COMMENT '记录刷新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='礼物赠送信息';

-- --------------------------------------------------------

--
-- 表的结构 `guard_info`
--

CREATE TABLE `guard_info` (
  `Id` bigint(20) NOT NULL,
  `uid` bigint(20) NOT NULL DEFAULT '0' COMMENT '观众uid',
  `username` varchar(50) DEFAULT '' COMMENT '观众昵称',
  `guard_level` int(11) DEFAULT NULL COMMENT '购买的舰长等级',
  `price` int(11) DEFAULT NULL COMMENT '所购买的舰长价值',
  `num` int(11) NOT NULL DEFAULT '0' COMMENT '购买月数',
  `send_time` int(11) DEFAULT NULL COMMENT '发送时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='舰长购买日志';

-- --------------------------------------------------------

--
-- 表的结构 `new_follower`
--

CREATE TABLE `new_follower` (
  `Id` int(11) NOT NULL,
  `uid` bigint(20) DEFAULT '0' COMMENT '观众UID',
  `username` varchar(50) DEFAULT NULL COMMENT '观众用户名',
  `mtime` bigint(20) DEFAULT '0' COMMENT '关注时间',
  `vipType` int(11) DEFAULT '0' COMMENT 'vip类型1=月费大会员 2=年费大会员',
  `vipDueDate` bigint(20) DEFAULT '0' COMMENT 'VIP截止时间',
  `vipStatus` int(11) DEFAULT '0' COMMENT 'vip状态1有效0无效'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='新粉丝列表';

-- --------------------------------------------------------

--
-- 表的结构 `realTime_data`
--

CREATE TABLE `realTime_data` (
  `Id` bigint(20) NOT NULL,
  `fllowers` int(11) DEFAULT NULL COMMENT '关注人数',
  `viewers` int(11) DEFAULT NULL COMMENT '观众人数',
  `fans_club` int(11) DEFAULT NULL COMMENT '粉丝团人数',
  `upload_time` int(11) DEFAULT NULL COMMENT '上传时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='实时信息记录表';

-- --------------------------------------------------------

--
-- 表的结构 `superchat_info`
--

CREATE TABLE `superchat_info` (
  `Id` bigint(20) NOT NULL,
  `uid` bigint(20) NOT NULL DEFAULT '0' COMMENT '观众uid',
  `username` varchar(50) DEFAULT '' COMMENT '观众昵称',
  `message` varchar(100) DEFAULT '' COMMENT '醒目留言消息',
  `price` int(11) DEFAULT NULL COMMENT '醒目留言价值',
  `send_time` int(11) DEFAULT NULL COMMENT '发送时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='醒目留言表';

-- --------------------------------------------------------

--
-- 表的结构 `title_info`
--

CREATE TABLE `title_info` (
  `uid` bigint(20) NOT NULL DEFAULT '0' COMMENT '观众uid',
  `username` varchar(50) DEFAULT '' COMMENT '用户昵称',
  `title_name` varchar(50) DEFAULT '' COMMENT '勋章名称',
  `title_level` int(11) DEFAULT '0' COMMENT '勋章等级',
  `title_owner_room` bigint(11) DEFAULT '0' COMMENT '勋章归属者直播间号',
  `title_owner_uid` bigint(20) NOT NULL COMMENT '勋章归属人uid',
  `update_time` int(11) DEFAULT NULL COMMENT '条目更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户勋章信息';

-- --------------------------------------------------------

--
-- 表的结构 `video_info`
--

CREATE TABLE `video_info` (
  `Id` bigint(20) NOT NULL,
  `comment` int(11) DEFAULT '0' COMMENT '评论数量',
  `typeId` int(11) DEFAULT '0' COMMENT '分区编号',
  `play` bigint(20) DEFAULT '0' COMMENT '播放数量',
  `copyright` varchar(50) DEFAULT NULL COMMENT '版权信息',
  `title` varchar(255) DEFAULT NULL COMMENT '视频标题',
  `created` bigint(20) DEFAULT '0' COMMENT '视频创建时间',
  `length` varchar(20) DEFAULT NULL COMMENT '视频时长',
  `danmu` int(11) DEFAULT '0' COMMENT '弹幕数量',
  `aid` bigint(20) DEFAULT '0' COMMENT '视频AV号',
  `bvid` varchar(30) NOT NULL COMMENT '视频BV号',
  `rtime` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='所有投稿的历史数据';

-- --------------------------------------------------------

--
-- 表的结构 `video_list`
--

CREATE TABLE `video_list` (
  `bvid` varchar(50) DEFAULT NULL COMMENT '视频编号',
  `utime` bigint(20) DEFAULT '0' COMMENT '投稿上传时间',
  `ctime` bigint(3) DEFAULT '0' COMMENT '检查时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='所有视频的bv索引号';

-- --------------------------------------------------------

--
-- 表的结构 `viewers_info`
--

CREATE TABLE `viewers_info` (
  `uid` bigint(20) NOT NULL COMMENT '观众uid',
  `username` varchar(50) DEFAULT '' COMMENT '用户昵称',
  `first_active` int(11) DEFAULT '0' COMMENT '首次活动时间',
  `laste_active` int(11) DEFAULT '0' COMMENT '最后活动时间',
  `entry_times` bigint(20) DEFAULT '0' COMMENT '进入次数',
  `danmu_count` bigint(20) DEFAULT '0' COMMENT '弹幕发送计数',
  `gift_count` bigint(20) DEFAULT NULL COMMENT '礼物赠送数量',
  `laste_activety` varchar(50) DEFAULT '' COMMENT '最后活动行为'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='观众总表';

--
-- 转储表的索引
--

--
-- 表的索引 `anchor_info`
--
ALTER TABLE `anchor_info`
  ADD PRIMARY KEY (`Id`);

--
-- 表的索引 `daily_gift_info`
--
ALTER TABLE `daily_gift_info`
  ADD PRIMARY KEY (`uid`,`record_date`);

--
-- 表的索引 `daily_viewers_info`
--
ALTER TABLE `daily_viewers_info`
  ADD PRIMARY KEY (`uid`,`record_date`);

--
-- 表的索引 `danmu_info`
--
ALTER TABLE `danmu_info`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Time_Check` (`upload_time`) COMMENT '索引时间加快查询速度';

--
-- 表的索引 `entry_info`
--
ALTER TABLE `entry_info`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `TimeTrack` (`entry_time`) COMMENT '索引时间信息加快速度';

--
-- 表的索引 `full_time_record`
--
ALTER TABLE `full_time_record`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Time_Check` (`upload_time`) COMMENT '索引时间加快查询速度';

--
-- 表的索引 `gift_history`
--
ALTER TABLE `gift_history`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Time_Check` (`send_time`) COMMENT '索引时间加快查询速度';

--
-- 表的索引 `gift_info`
--
ALTER TABLE `gift_info`
  ADD PRIMARY KEY (`uid`),
  ADD KEY `TimeTrack` (`record_update_time`,`update_time`) COMMENT '索引时间加快速度';

--
-- 表的索引 `guard_info`
--
ALTER TABLE `guard_info`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `TimeTrack` (`send_time`) COMMENT '索引时间加快速度';

--
-- 表的索引 `new_follower`
--
ALTER TABLE `new_follower`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `TimeTrack` (`mtime`) COMMENT '索引时间加快速度';

--
-- 表的索引 `realTime_data`
--
ALTER TABLE `realTime_data`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Time_Check` (`upload_time`) COMMENT '索引时间加快查询速度';

--
-- 表的索引 `superchat_info`
--
ALTER TABLE `superchat_info`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Time_Check` (`send_time`) COMMENT '索引时间加快查询速度';

--
-- 表的索引 `title_info`
--
ALTER TABLE `title_info`
  ADD PRIMARY KEY (`uid`),
  ADD KEY `TimeTrack` (`update_time`) COMMENT '索引时间加快速度';

--
-- 表的索引 `video_info`
--
ALTER TABLE `video_info`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Track` (`bvid`,`aid`);

--
-- 表的索引 `video_list`
--
ALTER TABLE `video_list`
  ADD UNIQUE KEY `Track` (`bvid`);

--
-- 表的索引 `viewers_info`
--
ALTER TABLE `viewers_info`
  ADD PRIMARY KEY (`uid`),
  ADD KEY `Track` (`laste_active`,`first_active`,`laste_activety`) COMMENT '索引关键查询词加快速度';

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `anchor_info`
--
ALTER TABLE `anchor_info`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `danmu_info`
--
ALTER TABLE `danmu_info`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `entry_info`
--
ALTER TABLE `entry_info`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `full_time_record`
--
ALTER TABLE `full_time_record`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `gift_history`
--
ALTER TABLE `gift_history`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `guard_info`
--
ALTER TABLE `guard_info`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `new_follower`
--
ALTER TABLE `new_follower`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `realTime_data`
--
ALTER TABLE `realTime_data`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `superchat_info`
--
ALTER TABLE `superchat_info`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `video_info`
--
ALTER TABLE `video_info`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
