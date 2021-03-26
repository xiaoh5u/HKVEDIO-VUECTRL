<template>
	<div style="height:100%">
		<el-row>
			<el-col :span="19">
				<div id="divPlugin" class="plugin"></div>
			</el-col>
			<el-col :span="5" class="controls">
				<!-- 窗口控件 -->
				<div class="windowControl">
					<el-divider content-position="left">预览</el-divider>
					<div class="container">
						<el-select v-model="wndNum" placeholder="请选择" @change="changeWndNum">
							<el-option v-for="item in wndList" :key="item.id" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
						<el-button class="button" type="primary" @click="clickStopRealPlay">关闭所有预览</el-button>
					</div>
				</div>
				<!-- 通道列表 -->
				<div class="channelList box">
					<el-divider content-position="left">监控列表</el-divider>
					<el-tree ref="tree" :data="hkvInfo.channels" show-checkbox node-key="id" :default-expanded-keys="[1]" :props="defaultProps"
						@check-change="treeHandleChange">

						<span slot-scope="{node,data}" class="customizeTree">
							<div class='dot' :style="{background:data.online == 'true'?'#1fad4e':'red'}"></div>
							<span>{{data.name}}</span>
						</span>

					</el-tree>
				</div>
				<!-- 云台控制 -->
				<div class="yuntaiControl box">
					<el-divider content-position="left">云台控制</el-divider>
					<div class="controlGroup container">
						<div class="el-button-group ">
							<div class="el-button primary" @mousedown="mouseDownPTZControl(5)" @mouseup="mouseUpPTZControl">左上</div>
							<div class="el-button primary" @mousedown="mouseDownPTZControl(1)" @mouseup="mouseUpPTZControl">向上</div>
							<div class="el-button primary" @mousedown="mouseDownPTZControl(7)" @mouseup="mouseUpPTZControl">右上</div>
						</div>
						<div class="el-button-group ">
							<div class="el-button primary" @mousedown="mouseDownPTZControl(3)" @mouseup="mouseUpPTZControl">向左</div>
							<div class="el-button primary" @mousedown="mouseDownPTZControl(9)" @mouseup="mouseUpPTZControl">自动</div>
							<div class="el-button primary" @mousedown="mouseDownPTZControl(4)" @mouseup="mouseUpPTZControl">向右</div>
						</div>
						<div class="el-button-group ">
							<div class="el-button primary" @mousedown="mouseDownPTZControl(6)" @mouseup="mouseUpPTZControl">左下</div>
							<div class="el-button primary" @mousedown="mouseDownPTZControl(2)" @mouseup="mouseUpPTZControl">向下</div>
							<div class="el-button primary" @mousedown="mouseDownPTZControl(8)" @mouseup="mouseUpPTZControl">右下</div>
						</div>
						<div class="el-button-group ">
							<div class="el-button primary" @mousedown="PTZZoomIn()" @mouseup="PTZZoomStop">变倍+</div>
							<div class="el-button primary" @mousedown="PTZZoomout()" @mouseup="PTZZoomStop">变倍-</div>
						</div>
					</div>
				</div>

				<div class="playback box" style="padding-bottom:40px">
					<el-divider content-position="left">回放</el-divider>
					<div class='container'>
						<el-form ref="playback" :inline="true" :model="playBackInfo" class="demo-form-inline" :rules="playbackRule"
							:show-message="false">
							<el-form-item prop="streamType" label="码流类型:" style="margin-bottom:5px">
								<el-select v-model="playBackInfo.streamType" placeholder="请选择" size="mini">
									<el-option v-for="item in recordStreamType" :key="item.id" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
								<el-button class="button" type="primary" size="mini" @click="clickRecordSearch(0)">搜索</el-button>
							</el-form-item>
							<el-form-item prop="channelId" label="选择通道:" style="margin-bottom:5px">
								<el-select v-model="playBackInfo.channelId" placeholder="请选择" size="mini">
									<el-option v-for="item in hkvInfo.channels" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="startTime" label="开始时间:" style="margin-bottom:5px">
								<el-date-picker v-model="playBackInfo.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择日期时间" size="mini" align="center">
								</el-date-picker>
							</el-form-item>
							<el-form-item prop="endTime" label="结束时间:" style="margin-bottom:5px">
								<el-date-picker v-model="playBackInfo.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"
									size="mini" align="center">
								</el-date-picker>
							</el-form-item>
							<!-- 回放下载保存路径 -->
							<el-form-item prop="localPath" label="下载保存路径:" style="margin-bottom:5px">
								<el-input ref="input" v-model="playBackInfo.localPath" style="width:210px" readonly size="mini">
									<el-button slot="append" @click="clickOpenFileDlg('downloadPath', 0)" icon="el-icon-edit"></el-button>
								</el-input>
							</el-form-item>
						</el-form>

						<div id="searchdiv" class="searchdiv">
							<el-table border :data="recordData" :height="200" :max-height="200" size="mini" v-loading="isProcess">
								<el-table-column align="center" type="index" width="50" label="序号"> </el-table-column>
								<el-table-column align="center" prop="szFileName" width="125" label="文件名称"> </el-table-column>
								<el-table-column align="center" prop="szStartTime" width="125" label="开始时间"> </el-table-column>
								<el-table-column align="center" prop="szEndTime" width="125" label="结束时间"> </el-table-column>
								<el-table-column align="center" label="操作" width="60">
									<template slot-scope="scope">
										<el-button size="mini" type="text" @click="clickStartDownloadRecord(scope.row)">下载</el-button>
									</template>
								</el-table-column>
							</el-table>
							<el-progress v-show="isProcess" type="circle" :percentage="processState"></el-progress>
						</div>
						<div class="el-button-group ">
							<div class="el-button primary" @click="clickStartPlayback">开始回放</div>
							<div class="el-button primary" @click="clickStopPlayback">停止回放</div>
							<div class="el-button primary" @click="clickReversePlayback">倒放</div>
							<div class="el-button primary" @click="clickFrame">单帧</div>
						</div>
						<div class="el-button-group ">
							<div class="el-button primary" @click="clickPause">暂停</div>
							<div class="el-button primary" @click="clickResume">恢复</div>
							<div class="el-button primary" @click="clickPlaySlow">慢放</div>
							<div class="el-button primary" @click="clickPlayFast">快放</div>
						</div>
						<!--<div class="el-button-group ">
							<div class="el-button primary" @click="clickCapturePic">抓图</div>
							<div class="el-button primary" @click="clickStartRecord('playback')">开始剪辑</div>
							<div class="el-button primary" @click="clickStopRecord('playback')">停止剪辑</div>
						</div> -->
					</div>
				</div>
			</el-col>
		</el-row>
		<el-dialog title="提示" :visible="dialogVisible" width="30%" :show-close="false">
			<p style="line-height:26px;font-size:16px">本视频控件目前仅支持在<b>IE8~IE11浏览器</b>下运行！</p>
			<p style="line-height:26px;font-size:16px">请复制以下链接至指定环境下查看~</p>
			<el-input v-model="currentHref" ref="address"  style="margin-top:10px">
				<el-button slot="append" icon="el-icon-document-copy" @click="copyText"></el-button>
			</el-input>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>


<script>
import { WebVideoCtrl } from '../../static/webVideoCtrl.js'
export default {
	data () {
		return {
			hkvInfo: {
				ip: 'xxx.xxx.xxx.xxx',//海康威视摄像头/硬盘录像机的ip地址
				port: '',//海康威视摄像头/硬盘录像机的端口
				username: 'admin',//海康威视摄像头/硬盘录像机的用户名
				password: '',//海康威视摄像头/硬盘录像机的密码
				channels: [],//海康威视摄像头/硬盘录像机的通道
			},
			mySelectWnd: 0,//当前选中的窗口
			g_bPTZAuto: false,
			iProtocol: 1,
			loginLoading: false,
			startPlayLoading: false,
			iStreamType: 1,
			bZeroChannel: false,
			iRtspPort: 0,
			wndNum: '1',
			wndList: [
				{
					label: '1x1',
					value: '1',
					id: '1',
				},
				{
					label: '2x2',
					value: '2',
					id: '2',
				},
				{
					label: '3x3',
					value: '3',
					id: '3',
				},
				{
					label: '4x4',
					value: '4',
					id: '4',
				}
			],
			defaultProps: {
				label: 'name'
			},
			useingWindows: [],
			playBackInfo: {
				streamType: 1,
				startTime: '2021-03-18 00:00:00',
				endTime: '2021-03-19 00:00:00',
				channelId: '1'
			},
			playbackRule: {
				streamType: [{ required: true, message: '码流不能为空' }],
				channelId: [{ required: true, message: '通道不能为空' }],
				startTime: [{ required: true, message: '开始时间不能为空' }],
				endTime: [{ required: true, message: '结束时间不能为空' }],
			},
			recordStreamType: [
				{
					label: '主码流',
					value: 1,
					id: 1,
				},
				{
					label: '子码流',
					value: 2,
					id: 2,
				},
			],

			// 下载录像
			g_iDownloadID: -1,
			g_tDownloadProcess: 0,
			g_iSearchTimes: 0,
			isProcess: false,
			processState: 0,
			recordData: [],
			dialogVisible: false,
			currentHref: window.location.href,

		}
	},
	created: function () {
		for (let i = 0; i < 4 * 4; i++) {
			this.useingWindows.push({ id: null })
		}
		this.setRecordDate()
	},
	mounted: function () {
		//判断浏览器环境
		if (!this.detectIE()) {
			this.dialogVisible = true
		} else {
			this.videoInitPlugin(); // 初始化video界面
			this.clickGetLocalCfg() //获取本地配置
		}
	},
	destroyed: function () {
		this.clickStopRealPlay();
		this.onLogout();
	},
	methods: {
		copyText () {
			this.$refs.address.select(); // 选中文本
			document.execCommand("copy"); // 执行浏览器复制命令 
			this.$message({ 
				message: '复制成功',
				type: 'success'
			});
		},
		//判断浏览器环境
		detectIE () {
			var ua = window.navigator.userAgent;
			// Test values; Uncomment to check result …
			// IE 10
			// ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
			// IE 11
			// ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
			// Edge 12 (Spartan)
			/* ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) 
			Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';*/
			// Edge 13
			/*ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) 
			Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';*/
			var msie = ua.indexOf('MSIE ');
			if (msie > 0) {
				// IE 10 or older => return version number
				return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
			}
			var trident = ua.indexOf('Trident/');
			if (trident > 0) {
				// IE 11 => return version number
				var rv = ua.indexOf('rv:');
				return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
			}
			// var edge = ua.indexOf('Edge/');
			// if (edge > 0) {
			// 	// Edge (IE 12+) => return version number
			// 	return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
			// }
			// other browser
			return false;
		},
		//设置回放时间
		setRecordDate () {
			this.$set(this.playBackInfo, 'startTime', WebVideoCtrl.yesterdayTime(1) + ` 00:00:00`)
			this.$set(this.playBackInfo, 'endTime', WebVideoCtrl.yesterdayTime(1) + ` 23:59:59`)
		},
		//判断窗口，自动变换
		// judgeWnd () {
		// 	let count = 0
		// 	this.useingWindows.forEach(item => {
		// 		if (item.id) count++
		// 	})
		// 	if (count > 1 && count <= 4 && this.wndNum == 1) {
		// 		this.wndNum = 2
		// 		this.changeWndNum(2)
		// 	}
		// },
		//树级节点勾选事件
		treeHandleChange (node, isChecked) {
			if (isChecked) {
				this.clickStartRealPlay(node.id)
			} else {
				// stopRealPlay
				for (let i = 0; i < this.useingWindows.length; i++) {
					if (this.useingWindows[i].id == node.id) {
						this.stopRealPlay(i)
						break
					}
				}
			}
		},
		changeWndNum (iType) {
			iType = parseInt(iType, 10);
			WebVideoCtrl.I_ChangeWndNum(iType);
		},
		onLogin () {
			let that = this;
			that.loginLoading = true;

			// 登录设备
			WebVideoCtrl.I_Login(that.hkvInfo.ip, that.iProtocol, that.hkvInfo.port, that.hkvInfo.username, that.hkvInfo.password, {
				async: false,
				success: function (xmlDoc) {
					// console.log('xmlDoc2', xmlDoc);//不能删除
					//TODO 获取通道信息
					that.getChannelInfo();
					that.getDevicePort(that.hkvInfo.ip + "_" + that.hkvInfo.port);
					that.loginLoading = false;

					that.$notify({
						showClose: true,
						message: '登录成功',
						type: 'success'
					});

					that.$refs.tree.setCheckedKeys([1]); //默认勾选第一个
					that.clickStartRealPlay(1) //默认播放第一个
				},
				error: function () {
					that.loginLoading = false;
					that.$notify({
						showClose: true,
						message: '登录失败',
						type: 'error'
					});
				}
			});
		},
		onLogout () {
			this.hkvInfo.channels = [];
			let szDeviceIdentify = this.hkvInfo.ip + "_" + this.hkvInfo.port;
			let iRet = WebVideoCtrl.I_Logout(szDeviceIdentify);
			if (0 == iRet) {
				this.$notify({
					showClose: true,
					message: '退出成功',
					type: 'success'
				});
			} else {
				this.$notify({
					showClose: true,
					message: '退出失败',
					type: 'error'
				});
			}
		},
		// 开始预览
		clickStartRealPlay (id) {
			this.startPlayLoading = true;
			const szDeviceIdentify = this.hkvInfo.ip + "_" + this.hkvInfo.port;
			const win = this.getWindow(id)
			this.startRealPlay(szDeviceIdentify, win, id)
			this.startPlayLoading = false;
		},
		videoInitPlugin: function () {
			let iRet = WebVideoCtrl.I_CheckPluginInstall();
			if (iRet === -1) {
				alert('您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装');
				return;
			}
			this.initPlugin()
		},
		initPlugin: function () {
			let that = this;
			WebVideoCtrl.I_InitPlugin('100%', '100%', {
				bWndFull: true,//是否支持单窗口双击全屏，默I_CheckPluginInstall
				iWndowType: 1,
				myCbSelWnd: function (xmlStr) { //自己新增的方法
					let jsonObj = that.$x2js.xml2js(xmlStr);
					that.mySelectWnd = jsonObj.RealPlayInfo.SelectWnd;
					let szInfo = "当前选择的窗口编号：" + that.mySelectWnd;
					console.log(szInfo);
				},
				cbInitPluginComplete: function () {
					WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
					// 检查插件是否最新
					if (WebVideoCtrl.I_CheckPluginVersion() === -1) {
						alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
						return;
					}
				}
			});
			that.onLogin()
		},
		getDevicePort: function (szDeviceIdentify) {
			let oPort = WebVideoCtrl.I_GetDevicePort(szDeviceIdentify);
			this.iRtspPort = oPort.iRtspPort;
		},
		//开始预览
		startRealPlay: function (szDeviceIdentify, iWndIndex, iChannelID) {
			let that = this;
			WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
				iRtspPort: that.iRtspPort,
				iWndIndex: iWndIndex,
				iStreamType: 1,
				iChannelID: iChannelID,
				bZeroChannel: that.bZeroChannel,
				success: function () {
					that.$notify({
						message: '开始预览通道' + iChannelID + '成功',
						type: 'success',
						duration: 2000
					});
				},
				error: function (status, xmlDoc2) {
					that.$notify({
						message: '开始预览通道' + iChannelID + '失败',
						type: 'error',
						duration: 2000
					});
					if (status === 403) {
						that.$notify({
							message: 'szInfo 设备不支持Websocket取流！',
							type: 'warning',
							duration: 2000
						});
					} else {
						that.$notify({
							message: '开始预览失败！',
							type: 'error',
							duration: 2000
						});
					}
				}
			});
		},
		//关闭所有预览
		clickStopRealPlay: function () {
			for (let i = 0; i < this.useingWindows.length; i++) {
				if (this.useingWindows[i].id) {
					this.stopRealPlay(i)
				}
			}
			this.$refs.tree.setCheckedKeys([]);
		},
		//关闭某个窗口预览
		stopRealPlay: function (iWndIndex) {
			let that = this;
			WebVideoCtrl.I_Stop({
				iWndIndex: iWndIndex,
				success: function () {
					that.$notify({
						message: '停止预览窗口' + iWndIndex + '成功',
						type: 'success',
						duration: 2000
					});
				},
				error: function () {
					that.$notify({
						message: '停止预览窗口' + iWndIndex + '失败',
						type: 'error',
						duration: 2000
					});
				}
			});
			this.useingWindows[iWndIndex].id = null
		},
		// 获取通道
		getChannelInfo: function () {
			let that = this;
			let szDeviceIdentify = this.hkvInfo.ip + "_" + this.hkvInfo.port;
			// 数字通道
			that.hkvInfo.channels = [];
			WebVideoCtrl.I_GetDigitalChannelInfo(szDeviceIdentify, {
				async: false,
				mysuccess: function (xmlStr) {
					let jsonObj = that.$x2js.xml2js(xmlStr)
					let list = jsonObj.InputProxyChannelStatusList.InputProxyChannelStatus;
					for (let x = 0; x < list.length; x++) {
						const item = {
							id: list[x].id,
							...list[x].sourceInputPortDescriptor
						}
						that.hkvInfo.channels.push(item);
					}
					console.log(that.hkvInfo.channels)
				},
				success: function (xmlDoc) {

				},
				error: function (status, xmlDoc) {
					that.$notify({
						message: '获取数字通道失败',
						type: 'error',
						duration: 2000
					});
				}
			}

			);
		},
		getWindow (id) {
			let win
			const { useingWindows, mySelectWnd } = this
			const oWndInfo = WebVideoCtrl.I_GetWindowStatus(mySelectWnd)
			// iPlayStatus 窗口播放状态：0-没有播放，1-预览，2-回放，3-暂停，4-单帧，5-倒放，6-倒放暂停
			console.log(oWndInfo)
			one: for (let i = 0; i < useingWindows.length; i++) {
				//选择的窗口已被使用
				if (oWndInfo && oWndInfo.iPlayStatus > 0) {
					if (oWndInfo.iPlayStatus > 1) {
						this.stopRealPlay(mySelectWnd)
						win = mySelectWnd
						break one;
					}
					two: for (let j = 0; j < useingWindows.length; j++) {
						const otherWin = WebVideoCtrl.I_GetWindowStatus(j)
						//寻找一个最近的空位
						if (!otherWin || (otherWin && otherWin.iPlayStatus == 0)) {
							win = j
							break two;
						}
					}
					break one;
				} else {
					//窗口未占用
					win = mySelectWnd
					break one;
				}
			}

			console.log(win)
			this.useingWindows[win].id = id
			console.log(this.useingWindows)
			return win
		},
		mouseDownPTZControl: function (iPTZIndex) {
			let oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd);

			if (oWndInfo !== null) {
				if (iPTZIndex === 9 && this.g_bPTZAuto) {
					iPTZSpeed = 0;
				} else {
					this.g_bPTZAuto = false;
				}

				WebVideoCtrl.I_PTZControl(iPTZIndex, false, {
					iPTZSpeed: 4,
					mysuccess: function (xmlStr) {
						console.log("I_PTZControl", xmlStr);
						if (iPTZIndex === 9 && this.g_bPTZAuto) {
							console.log(oWndInfo.szDeviceIdentify + " 停止云台成功！mouseDown");
						} else {
							console.log(oWndInfo.szDeviceIdentify + " 开启云台成功！mouseDown");
						}
						if (iPTZIndex === 9) {
							this.g_bPTZAuto = !this.g_bPTZAuto;
						}
					},
					error: function (status, xmlDoc) {
						console.log(oWndInfo.szDeviceIdentify + " 开启云台失败！mouseDown", status, xmlDoc);
					}
				});
			}
		},
		mouseUpPTZControl: function () {
			let oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd);
			if (oWndInfo !== null) {
				WebVideoCtrl.I_PTZControl(1, true, {
					mysuccess: function (xmlStr) {
						console.log(oWndInfo.szDeviceIdentify + " 停止云台成功！mouseUp", xmlStr)
					},
					error: function (status, xmlDoc) {
						console.log(oWndInfo.szDeviceIdentify + " 停止云台失败！mouseUp", status, xmlDoc);
					}
				});
			}
		},
		//变倍+
		PTZZoomIn () {
			let oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd);

			if (oWndInfo != null) {
				WebVideoCtrl.I_PTZControl(10, false, {
					iWndIndex: this.mySelectWnd,
					success: function (xmlDoc) {
						console.log(oWndInfo.szDeviceIdentify + " 调焦+成功！");
					},
					error: function (status, xmlDoc) {
						console.log(oWndInfo.szDeviceIdentify + "  调焦+失败！", status, xmlDoc);
					}
				});
			}
		},
		//变倍-
		PTZZoomout () {
			let oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd);

			if (oWndInfo != null) {
				WebVideoCtrl.I_PTZControl(11, false, {
					iWndIndex: this.mySelectWnd,
					success: function (xmlDoc) {
						console.log(oWndInfo.szDeviceIdentify + " 调焦-成功！");
					},
					error: function (status, xmlDoc) {
						console.log(oWndInfo.szDeviceIdentify + "  调焦-失败！", status, xmlDoc);
					}
				});
			}
		},
		//停止变倍
		PTZZoomStop () {
			let oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd);

			if (oWndInfo != null) {
				WebVideoCtrl.I_PTZControl(11, true, {
					iWndIndex: this.mySelectWnd,
					success: function (xmlDoc) {
						console.log(oWndInfo.szDeviceIdentify + " 调焦停止成功！");
					},
					error: function (status, xmlDoc) {
						console.log(oWndInfo.szDeviceIdentify + "  调焦停止失败！", status, xmlDoc);
					}
				});
			}
		},

		// 搜索录像
		clickRecordSearch (iType) {
			const that = this
			let validateType = true
			this.$refs.playback.validate((valid) => {
				if (!valid) {
					validateType = false
				}
			});
			if (!validateType) return
			const { g_iSearchTimes, playBackInfo, hkvInfo } = this
			const { streamType, channelId, startTime, endTime } = playBackInfo
			let szDeviceIdentify = hkvInfo.ip + "_" + hkvInfo.port,
				iChannelID = channelId,
				iStreamType = streamType,
				szStartTime = startTime,
				szEndTime = endTime;
			if (null == szDeviceIdentify) {
				return;
			}

			if (this.bZeroChannel) {// 零通道不支持录像搜索
				return;
			}

			if (0 == iType) {// 首次搜索
				this.recordData = []
				this.g_iSearchTimes = 0;
			}
			console.log(szDeviceIdentify, iChannelID, szStartTime, szEndTime, iStreamType)
			WebVideoCtrl.I_RecordSearch(szDeviceIdentify, iChannelID, szStartTime, szEndTime, {
				iStreamType: iStreamType,
				iSearchPos: g_iSearchTimes * 40,
				async: true,
				success: function (xmlDoc) {
					// console.log(xmlDoc)
					let jsonObj = that.$x2js.xml2js(xmlDoc)
					const result = jsonObj.CMSearchResult

					const handleList = () => {
						const list = result.matchList.searchMatchItem
						for (let i = 0; i < list.length; i++) {
							const item = list[i]
							let szPlaybackURI = item.playbackURI;
							if (szPlaybackURI.indexOf("name=") < 0) {
								break;
							}
							let szStartTime = item.startTime
							let szEndTime = item.endTime
							let szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));

							const data = {
								szFileName: szFileName,
								szStartTime: (szStartTime.replace("T", " ")).replace("Z", " "),
								szEndTime: (szEndTime.replace("T", " ")).replace("Z", " "),
								playbackURI: item.playbackURI
							}
							that.recordData.push(data)
						}
					}

					if ("MORE" === result.responseStatusStrg) {
						handleList()
						that.g_iSearchTimes++;
						that.clickRecordSearch(1);// 继续搜索
					} else if ("OK" === result.responseStatusStrg) {
						handleList()
						that.$notify({
							message: '搜索录像文件成功！',
							type: 'success',
							duration: 2000
						});
					} else if ("NO MATCHES" === result.responseStatusStrg) {
						that.$notify({
							message: '没有录像文件！',
							type: 'warning',
							duration: 2000
						});
					}
				},
				error: function (status, xmlDoc) {
					that.$notify({
						message: '搜索录像文件失败！',
						type: 'error',
						duration: 2000
					});
				}
			});
		},
		//下载录像
		clickStartDownloadRecord (item) {
			const that = this
			const { playBackInfo, hkvInfo } = this
			let szDeviceIdentify = hkvInfo.ip + "_" + hkvInfo.port,
				szChannelID = playBackInfo.channelId,
				szFileName = item.fileName,
				szPlaybackURI = item.playbackURI

			if (null == szDeviceIdentify) {
				return;
			}

			this.g_iDownloadID = WebVideoCtrl.I_StartDownloadRecord(szDeviceIdentify, szPlaybackURI, szFileName, {
				bDateDir: true  //是否生成日期文件
			});

			if (this.g_iDownloadID < 0) {
				var iErrorValue = WebVideoCtrl.I_GetLastError();
				if (34 == iErrorValue) {
					that.$notify({
						message: '已下载！',
						type: 'warning',
						duration: 2000
					});
				} else if (33 == iErrorValue) {
					that.$notify({
						message: '空间不足！',
						type: 'warning',
						duration: 2000
					});
				} else {
					that.$notify({
						message: '下载失败！',
						type: 'error',
						duration: 2000
					});
				}
			} else {
				this.isProcess = true
				this.g_tDownloadProcess = setInterval(this.downProcess, 2000);
			}
		},
		// 下载进度
		downProcess () {
			const { g_iDownloadID, g_tDownloadProcess } = this
			var iStatus = WebVideoCtrl.I_GetDownloadStatus(g_iDownloadID);
			if (0 == iStatus) {
				var iProcess = WebVideoCtrl.I_GetDownloadProgress(g_iDownloadID);
				if (iProcess < 0) {
					clearInterval(g_tDownloadProcess);
					this.g_tDownloadProcess = 0;
					this.g_iDownloadID = -1;
				} else if (iProcess < 100) {
					this.processState = iProcess
				} else {
					this.processState = 100
					setTimeout(() => {
						this.isProcess = false
					}, 2000);

					WebVideoCtrl.I_StopDownloadRecord(g_iDownloadID);

					this.$notify({
						message: '录像下载完成！',
						type: 'success',
						duration: 2000
					});

					clearInterval(g_tDownloadProcess);
					this.g_tDownloadProcess = 0;
					this.g_iDownloadID = -1;
				}
			} else {
				WebVideoCtrl.I_StopDownloadRecord(g_iDownloadID);

				clearInterval(g_tDownloadProcess);
				this.g_tDownloadProcess = 0;
				this.g_iDownloadID = -1;
			}
		},
		// 打开选择框 0：文件夹  1：文件
		clickOpenFileDlg (id, iType) {

			const szDirPath = WebVideoCtrl.I_OpenFileDlg(iType);
			if (szDirPath != -1 && szDirPath != "" && szDirPath != null) {

				this.$set(this.playBackInfo, 'localPath', szDirPath)
				console.log(szDirPath)
				let szInfo = ''
				const iRet = WebVideoCtrl.I_SetLocalCfg({ DownloadPath: szDirPath });

				if (0 == iRet) {
					szInfo = "本地配置设置成功！";
				} else {
					szInfo = "本地配置设置失败！";
				}
				console.log(szInfo);
			}
		},
		// 获取本地配置参数
		clickGetLocalCfg () {
			var xmlDoc = WebVideoCtrl.I_GetLocalCfg();
			console.log(xmlDoc)
			if (xmlDoc != null) {
				this.$set(this.playBackInfo, 'localPath', $(xmlDoc).find("DownloadPath").eq(0).text())
				console.log('获取本地参数成功')
			} else {
				console.log('获取本地参数失败')
			}
		},

		// 开始回放
		clickStartPlayback () {
			const that = this
			const { playBackInfo, hkvInfo, iRtspPort, bZeroChannel, mySelectWnd } = this
			const { streamType, channelId, startTime, endTime } = playBackInfo
			//验证表单
			let validateType = true
			this.$refs.playback.validate((valid) => {
				if (!valid) {
					validateType = false
				}
			});
			if (!validateType) return
			this.judgeChecked()

			var oWndInfo = WebVideoCtrl.I_GetWindowStatus(mySelectWnd),
				szDeviceIdentify = hkvInfo.ip + "_" + hkvInfo.port,
				iStreamType = streamType,
				iChannelID = channelId,
				szStartTime = startTime,
				szEndTime = endTime,
				szInfo = "",
				iRet = -1;
			if (null == szDeviceIdentify) {
				return;
			}

			if (bZeroChannel) {// 零通道不支持回放
				return;
			}

			var startPlayback = function () {
				WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
					iRtspPort: iRtspPort,
					iStreamType: iStreamType,
					iChannelID: iChannelID,
					szStartTime: szStartTime,
					szEndTime: szEndTime,
					success: function () {
						that.$notify({
							message: '开始回放成功！',
							type: 'success',
							duration: 2000
						});
					},
					error: function (status, xmlDoc) {
						if (403 === status) {

							that.$notify({
								message: '设备不支持Websocket取流！',
								type: 'error',
								duration: 2000
							});
						} else {
							that.$notify({
								message: '开始回放失败！',
								type: 'error',
								duration: 2000
							});
						}
						console.log(szDeviceIdentify + " " + szInfo);
					}
				});
			};

			if (oWndInfo != null) {// 已经在播放了，先停止
				WebVideoCtrl.I_Stop({
					success: function () {
						startPlayback();
					}
				});
			} else {
				startPlayback();
			}
		},
		//判断选中状态
		judgeChecked () {
			const { useingWindows, mySelectWnd } = this
			if (useingWindows[mySelectWnd].id != null) {
				let keys = this.$refs.tree.getCheckedKeys()
				const id = (useingWindows[mySelectWnd].id).toString()
				if (keys.indexOf(id) >= 0) {
					keys.splice(keys.indexOf(id), 1)
					this.$refs.tree.setCheckedKeys(keys)
					this.stopRealPlay(mySelectWnd)
				}
			}
		},

		// 停止回放
		clickStopPlayback () {
			const that = this
			this.judgeChecked()
			var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd),
				szInfo = "";

			if (oWndInfo != null) {
				WebVideoCtrl.I_Stop({
					success: function () {
						that.$notify({
							message: '停止回放成功！',
							type: 'success',
							duration: 2000
						});
					},
					error: function () {
						that.$notify({
							message: '停止回放失败！',
							type: 'error',
							duration: 2000
						});
					}
				});
			}
		},

		// 开始倒放
		clickReversePlayback () {
			const that = this
			const { playBackInfo, hkvInfo, iRtspPort, bZeroChannel, mySelectWnd } = this
			const { streamType, channelId, startTime, endTime } = playBackInfo
			//验证表单
			let validateType = true
			this.$refs.playback.validate((valid) => {
				if (!valid) {
					validateType = false
				}
			});
			if (!validateType) return
			this.judgeChecked()

			var oWndInfo = WebVideoCtrl.I_GetWindowStatus(mySelectWnd),
				szDeviceIdentify = hkvInfo.ip + "_" + hkvInfo.port,
				iStreamType = streamType,
				iChannelID = channelId,
				szStartTime = startTime,
				szEndTime = endTime,
				szInfo = "",
				iRet = -1;

			if (null == szDeviceIdentify) {
				return;
			}

			if (bZeroChannel) {// 零通道不支持倒放
				return;
			}

			var reversePlayback = function () {
				var iRet = WebVideoCtrl.I_ReversePlayback(szDeviceIdentify, {
					iRtspPort: iRtspPort,
					iStreamType: iStreamType,
					iChannelID: iChannelID,
					szStartTime: szStartTime,
					szEndTime: szEndTime
				});

				if (0 == iRet) {
					that.$notify({
						message: '开始倒放成功！',
						type: 'success',
						duration: 2000
					});
				} else {
					that.$notify({
						message: '开始倒放失败！',
						type: 'error',
						duration: 2000
					});
				}
			};

			if (oWndInfo != null) {// 已经在播放了，先停止
				WebVideoCtrl.I_Stop({
					success: function () {
						reversePlayback();
					}
				});
			} else {
				reversePlayback();
			}
		},

		// 单帧
		clickFrame () {
			const that = this
			var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd),
				szInfo = "";

			if (oWndInfo != null) {
				WebVideoCtrl.I_Frame({
					success: function () {
						that.$notify({
							message: '单帧播放成功！',
							type: 'success',
							duration: 2000
						});
					},
					error: function () {
						that.$notify({
							message: '单帧播放失败！',
							type: 'error',
							duration: 2000
						});
					}
					,
				});
			}
		},
		// 暂停
		clickPause () {
			const that = this
			var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd),
				szInfo = "";

			if (oWndInfo != null) {
				WebVideoCtrl.I_Pause({
					success: function () {
						that.$notify({
							message: '暂停成功！',
							type: 'success',
							duration: 2000
						});
					},
					error: function () {
						that.$notify({
							message: '暂停失败！',
							type: 'error',
							duration: 2000
						});
					}
				});
			}
		},

		// 恢复
		clickResume () {
			const that = this
			var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd),
				szInfo = "";

			if (oWndInfo != null) {
				WebVideoCtrl.I_Resume({
					success: function () {
						that.$notify({
							message: '恢复成功！',
							type: 'success',
							duration: 2000
						});
					},
					error: function () {
						that.$notify({
							message: '恢复失败！',
							type: 'error',
							duration: 2000
						});
					}
				});
			}
		},

		// 慢放
		clickPlaySlow () {
			const that = this
			var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd),
				szInfo = "";

			if (oWndInfo != null) {
				WebVideoCtrl.I_PlaySlow({
					success: function () {
						that.$notify({
							message: '慢放成功！',
							type: 'success',
							duration: 2000
						});
					},
					error: function () {
						that.$notify({
							message: '慢放失败！',
							type: 'error',
							duration: 2000
						});
					}
				});
			}
		},

		// 快放
		clickPlayFast () {
			const that = this
			var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd),
				szInfo = "";

			if (oWndInfo != null) {
				WebVideoCtrl.I_PlayFast({
					success: function () {
						that.$notify({
							message: '快放成功！',
							type: 'success',
							duration: 2000
						});
					},
					error: function () {
						that.$notify({
							message: '快放失败！',
							type: 'error',
							duration: 2000
						});
					}
				});
			}
		},

	}
}
</script>

<style lang="scss" scoped>
.plugin {
	width: 100%;
	height: 100vh;
}
.container {
	margin: 0 10px;
}
.box {
	margin-top: 10px;
}

.controls {
	padding: 6px;
	overflow: auto;
	height: 100vh;
	.windowControl {
		& > div {
			display: flex;
			justify-content: space-between;
		}
		.button {
			margin-left: 5px;
		}
	}
	.channelList {
		.customizeTree {
			display: flex;
			align-items: center;
			.dot {
				width: 12px;
				height: 12px;
				border-radius: 50%;
				margin-right: 4px;
			}
		}
	}
	.yuntaiControl {
		.controlGroup {
			display: flex;
			flex-direction: column;
		}
	}
	>>> .playback {
		.searchdiv {
			border: 1px solid #7f9db9;
			font-size: 12px;
			margin-bottom: 10px;
			position: relative;
			.el-progress--circle {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				z-index: 9999;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		#searchlist {
			td,
			th {
				padding: 2px;
				border: 1px solid #7f9db9;
				border-collapse: collapse;
				white-space: nowrap;
			}
		}
	}
}
</style>
