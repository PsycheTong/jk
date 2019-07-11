var vue;
var map;
var data;
var districtExplorer;
var distSelFx;
window.onload =function() { 
 initVue();

};

function initMap(){
map = new CMMap.Map("map", {
	mapStyle: "cmmap://styles/darkblue" ,
	center: [116.397428, 39.90923], 
	zoom: 10,
	zooms: [3, 18],
	defaultCursor: "default",
	animateEnable: true,
	rotateEnable: false,
	resizeEnable: false,
	dragEnable: true,
	zoomEnable: true,
	doubleClickZoom: false,
	keyboardEnable: true,
	jogEnable: true,
	scrollWheel: true,
	touchZoom: true
});
map.on('click',function (ev) {
	if(districtfeature){
		vue.getIndicatorInfo(districtfeature.properties.name);
		vue.createPieCharts(vue.city, vue.current_tap);
	}
});
map.on('dbclick',function (ev) {
	//console.log('dbclick');
	if(districtfeature){
		vue.featureClick(districtfeature,true);
	}
})
CMMap.Conf._key='35b05qu35qjw4gwg30i6u5n69km00abn';
}
var districtfeature;
function loadAreaNode(adcode){

if(!DistrictExplorer)
	return;

if(!districtExplorer){
	districtExplorer = new DistrictExplorer({
	  eventSupport:true,
		map: map //关联的地图实例
	});

	//feature被点击
	// districtExplorer.on('featureClick', function(e, feature) {
	//     vue.featureClick(feature,true);
	// });
	//鼠标移入feature对应的区域触发
	districtExplorer.on('featureMouseover', function(e, feature) {
		districtfeature = feature;
	});
	//鼠标移出 feature对应的区域触发
	districtExplorer.on('featureMouseout', function(e, feature) {
		districtfeature = null;
	});

}
  districtExplorer.loadAreaNode(adcode, function(error, areaNode) {

  if (error) {
	 //console.error(error);
	 return;
  }
   //设置当前使用的定位用节点
   districtExplorer.setAreaNodesForLocating([areaNode]);
  //绘制载入的区划节点
  renderAreaNode(areaNode);
});
}

function renderAreaNode(areaNode) {
//清除小区的多边形
clearHousePolygon();

//清除已有的绘制内容
districtExplorer.clearFeaturePolygons();

//绘制子级区划
districtExplorer.renderSubFeatures(areaNode, function(feature, i) {

  var fillColor = '#1c6296';
  var strokeColor = '#50b0f7';

  return {
	 cursor: 'default',
	 bubble: true,
	 strokeColor: strokeColor, //线颜色
	 strokeOpacity: 1, //线透明度
	 strokeWeight: 1, //线宽
	 fillColor: fillColor, //填充色
	 fillOpacity: 0.35, //填充透明度
  };
});
//更新地图视野以适合区划面
map.setFitView(districtExplorer.getAllFeaturePolygons());
}

function clearAreaNode(){
//清除已有的绘制内容
districtExplorer.clearFeaturePolygons();
}
var housePolygon;
function renderHourse(path){
if(!path||path.length<=0)
	return;
clearAreaNode();
var fillColor = '#1c6296';
var strokeColor = '#50b0f7';
clearHousePolygon();
housePolygon = new CMMap.Polygon({
	  path: path, //设置线覆盖物路径
	  strokeColor: strokeColor, //线颜色
	  strokeOpacity: 0, //线透明度
	  strokeWeight: 2, //线宽
	  fillColor: fillColor, //填充色
	  fillOpacity: 0.5 //填充透明度
	});
housePolygon.setMap(map);
map.setFitView([housePolygon],1.25);
}
function clearHousePolygon() {
if(housePolygon){
	housePolygon.setMap(null);
	housePolygon = null;
}

}

function initVue(){
vue = new Vue({
	el: '#app',
	data: {
		status:1,//1为省 2为市 3为区
		isshowchart:true,
		istoast:false,
		toastmsg:'',
		current_tap:'COVER_COUNT',//当前所在的选项
		current_cell:'覆盖与实装率',
			province:'辽宁省',
		provincecode:'210000',
			city:'沈阳市',//默认城市
		cityCode:'210100',//默认城市
			district:'和平区',//默认区县
		districtcode:'210102',//默认区县
			house:'',


		type	                :'',//           1、小区、2县区、3地市（包括999省中心）	
		id	                    :'',//           粒度编码	
		name	                :'',//           粒度	
		cover_count	            :'',//           覆盖家庭户数	
		onu_port	            :'',//           设备端口数	
		onu_used_port	        :'',//           占用端口数	
		cover_rate	            :'',//           家庭覆盖率	
		port_cover_rate	        :'',//           端口覆盖率	
		cell_user_rate	        :'',//           客户实装率	
		pos_user_rate	        :'',//           端口实装率	
		home_cnt	            :'',//           移动到达客户数	
		home_light_cnt	        :'',//           光客户数	
		r_new_dk_cnt	        :'',//           单宽	日新增
		r_new_fuse_cnt	        :'',//           融合	
		r_new_100_cnt	        :'',//           100m以下	
		r_new_100_200_cnt	    :'',//           100m-200m（不含200m）	
		r_new_200_cnt	        :'',//           200m及以上	
		r_new_cnt	            :'',//           合计	
		y_new_dk_cnt	        :'',//           单宽	月新增
		y_new_fuse_cnt	        :'',//           融合	
		y_new_100_cnt	        :'',//           100m以下	
		y_new_100_200_cnt	    :'',//           100m-200m（不含200m）	
		y_new_200_cnt	        :'',//           200m及以上	
		y_new_cnt	            :'',//           合计	
		n_new_dk_cnt	        :'',//           单宽	年新增
		n_new_fuse_cnt	        :'',//           融合	
		n_new_100_cnt	        :'',//           100m以下	
		n_new_100_200_cnt	    :'',//           100m-200m（不含200m）	
		n_new_200_cnt	        :'',//           200m及以上	
		n_new_cnt	            :'',//           合计	
		dd_dk_cnt	            :'',//           单宽	到达
		dd_fuse_cnt	            :'',//           融合	
		dd_20_cnt	            :'',//           20m以下	
		dd_20_50_cnt	        :'',//           20m-50m（不含50m）	
		dd_50_100_cnt	        :'',//           50m-100m（不含100m）	
		dd_100_200_cnt	        :'',//           100m-200m（不含200m）	
		dd_200_cnt	            :'',//           200m及以上	
		dd_home_cnt	            :'',//           合计	
		dd_act_cnt	            :'',//           活跃客户数	其他
		act_rate	            :'',//           月活跃度	
		pj_act_rate	            :'',//           月均活跃度	
		new_100_rate            :'',//           新增100m及以上占比	
		dd_100_rate	            :'',//           存量100m及以上占比	
		new_fuse_rate	        :'',//           新增融合占比	
		dd_fuse_rate	        :'',//           存量融合占比	
		new_kd_should_fee	    :'',//           单宽	经分：本月新增
		new_ft_fee	            :'',//           融合	
		new_arpu	            :'',//           合计	
		kd_should_fee	        :'',//           单宽	经分：到达
		ft_fee	                :'',//           融合	
		arpu	                :'',//           合计	
		mbh_cnt	                :'',//           宽带电视到达用户数 	
		mbh_st_rate	            :'',//           宽带电视渗透率	
		d_mbh_new_cnt	        :'',//           宽带电视本日新增用户数	
		y_mbh_new_cnt	        :'',//           宽带电视本月新增用户数	
		y_jj_mbh_cnt	        :'',//           宽带电视本月净增用户数	
		n_jj_mbh_cnt	        :'',//           宽带电视本年净增用户数	
		mbh_activation_rate	    :'',//           宽带电视激活度	
		y_mbh_activation_rate	:'',//           当月新增激活率	
		mbh_active_rate	        :'',//           宽带电视活跃度	
		mbh_fee	                :'',//           宽带电视本月收入	
		lj_mbh_fee	            :'',//           宽带电视累计收入	
		hemu_cnt	            :'',//           和目本月新增	
		hemu_new_cnt	        :'',//           和目客户到达	
		tel_cnt                 :'',//                 固话客户本月新增	
		tel_new_cnt             :'',//                固话客户到达	
		y_lw_cnt	            :'',//           本月离网	
		lw_rate	                :'',//           本月离网率	
		dd_off_cnt              :'',//                         离线用户数
		port_conver_rate        :'',//                   端口覆盖率
		
		bool_arr:{
			"bool_type":false,
			"bool_id":false,
			"bool_name":false,
			"bool_cover_count":true,  
			"bool_onu_port":true,
			"bool_onu_used_port":true,
			"bool_cover_rate":true,
			"bool_port_cover_rate":true,  
			"bool_cell_user_rate":true,
			"bool_pos_user_rate":true,
			"bool_home_cnt":true,
			"bool_home_light_cnt":true,
			"bool_r_new_dk_cnt":false,
			"bool_r_new_fuse_cnt":false,
			"bool_r_new_100_cnt":false,
			"bool_r_new_100_200_cnt":false,
			"bool_r_new_200_cnt":false,
			"bool_r_new_cnt":false,
			"bool_y_new_dk_cnt":false,
			"bool_y_new_fuse_cnt":false,
			"bool_y_new_100_cnt":false,
			"bool_y_new_100_200_cnt":false,
			"bool_y_new_200_cnt":false,
			"bool_y_new_cnt":false,
			"bool_n_new_dk_cnt":false,
			"bool_n_new_fuse_cnt":false,
			"bool_n_new_100_cnt":false,
			"bool_n_new_100_200_cnt":false,
			"bool_n_new_200_cnt":false,
			"bool_n_new_cnt":false,
			"bool_dd_dk_cnt":false,
			"bool_dd_fuse_cnt ":false,  
			"bool_dd_20_cnt":false,
			"bool_dd_20_50_cnt":false,
			"bool_dd_50_100_cnt":false,
			"bool_dd_100_200_cnt":false,
			"bool_dd_200_cnt":false,
			"bool_dd_home_cnt ":false,  
			"bool_dd_act_cnt":false,
			"bool_act_rate":false,
			"bool_pj_act_rate":false,  
			"bool_new_100_rate":false,
			"bool_dd_100_rate":false,  
			"bool_new_fuse_rate":false,
			"bool_dd_fuse_rate":false,
			"bool_new_kd_should_fee":false,
			"bool_new_ft_fee":false,
			"bool_new_arpu":false,
			"bool_kd_should_fee ":false,
			"bool_ft_fee":false,
			"bool_arpu":false,
			"bool_mbh_cnt":false,  
			"bool_mbh_st_rate":false,  
			"bool_d_mbh_new_cnt":false,
			"bool_y_mbh_new_cnt":false,
			"bool_y_jj_mbh_cnt":false,
			"bool_n_jj_mbh_cnt":false,
			"bool_mbh_activation_rate":false,  
			"bool_y_mbh_activation_rate":false,
			"bool_mbh_active_rate":false,  
			"bool_mbh_fee":false,  
			"bool_lj_mbh_fee":false,
			"bool_hemu_cnt":false,
			"bool_hemu_new_cnt":false,
			"bool_tel_cnt" :false,
			"bool_tel_new_cnt":false,
			"bool_y_lw_cnt":false,
			"bool_lw_rate":false,  
			"bool_dd_off_cnt" :false,
			"bool_port_conver_rate" :false,
		},
		
		distdetails:{
		  "211300":[{
					  "adcode": 211302,                     
					  "cityCode": 211300,                         
					  "name": "双塔区"
					}, {
					  "adcode": 211303,
					  "cityCode": 211300,
					  "name": "龙城区"
					}, {
					  "adcode": 211321,
					  "cityCode": 211300,
					  "name": "朝阳县"
					}, {
					  "adcode": 211322,
					  "cityCode": 211300,
					  "name": "建平县"
					}, {
					  "adcode": 211324,
					  "cityCode": 211300,
					  "name": "喀喇沁左翼蒙古族自治县"
					}, {
					  "adcode": 211381,
					  "cityCode": 211300,
					  "name": "北票市"
					}, {
					  "adcode": 211382,
					  "cityCode": 211300,
					  "name": "凌源市"
			}],
			"211200":[
						{
							"adcode": 211202,
							"cityCode": 211200,
							"name": "银州区"
						},
						{
							"adcode": 211204,
							"cityCode": 211200,
							"name": "清河区"
						},
						{
							"adcode": 211221,
							"cityCode": 211200,
							"name": "铁岭县"
						},
						{
							"adcode": 211223,
							"cityCode": 211200,
							"name": "西丰县"
						},
						{
							"adcode": 211224,
							"cityCode": 211200,
							"name": "昌图县"
						},
						{
							"adcode": 211281,
							"cityCode": 211200,
							"name": "调兵山市"
						},
						{
							"adcode": 211282,
							"cityCode": 211200,
							"level": "district",
							"name": "开原市"
						}
					],
					"211100":[
								  {
									  "adcode": 211102,
									  "cityCode": 211100,
									  "name": "双台子区"
								  },
								  {
									  "adcode": 211103,
									  "cityCode": 211100,
									  "name": "兴隆台区"
								  },
								  {
									  "adcode": 211104,
									  "cityCode": 211100,
									  "name": "大洼区"
								  },
								  {
									  "adcode": 211122,
									  "cityCode": 211100,
									  "name": "盘山县"
								  }
							  ],
				   "210900":[
						{
							"adcode": 210902,
							"cityCode": 210900,       
							"name": "海州区"
						},
						{
							"adcode": 210903,
							"cityCode": 210900,
							"name": "新邱区"
						},
						{
							"adcode": 210904,
							"cityCode": 210900,
							"name": "太平区"
						},
						{
							"adcode": 210905,
							"cityCode": 210900,
							"name": "清河门区"
						},
						{
							"adcode": 210911,
							"cityCode": 210900,
							"name": "细河区"
						},
						{
							"adcode": 210921,
							"cityCode": 210900,
							"name": "阜新蒙古族自治县"
						},
						{
							"adcode": 210922,
							"cityCode": 210900,
							"name": "彰武县"
						}
					],
					"210800":[{
						  "adcode": 210802,
						  "cityCode": 210800,
						  "name": "站前区"
						}, {
						  "adcode": 210803,
						  "cityCode": 210800,
						  "name": "西市区"
						}, {
						  "adcode": 210804,
						  "cityCode": 210800,
						  "name": "鲅鱼圈区"
						}, {
						  "adcode": 210811,
						  "cityCode": 210800,
						  "name": "老边区"
						}, {
						  "adcode": 210881,
						  "cityCode": 210800,
						  "name": "盖州市"
						}, {
						  "adcode": 210882,
						  "cityCode": 210800,
						  "name": "大石桥市"
						}],
						"210700":[{
							  "adcode": 210702,
							  "cityCode": 210700,
							  "name": "古塔区"
							}, {
							  "adcode": 210703,
							  "cityCode": 210700,
							  "name": "凌河区"
							}, {
							  "adcode": 210711,
							  "cityCode": 210700,
							  "name": "太和区"
							}, {
							  "adcode": 210726,
							  "cityCode": 210700,
							  "name": "黑山县"
							}, {
							  "adcode": 210727,
							  "cityCode": 210700,
							  "name": "义县"
							}, {
							  "adcode": 210781,
							  "cityCode": 210700,
							  "name": "凌海市"
							}, {
							  "adcode": 210782,
							  "cityCode": 210700,
							  "name": "北镇市"
							}],
							"210600":[{
								  "adcode": 210602,
								  "cityCode": 210600,
								  "name": "元宝区"
								}, {
								  "adcode": 210603,
								  "cityCode": 210600,
								  "name": "振兴区"
								}, {
								  "adcode": 210604,
								  "cityCode": 210600,
								  "name": "振安区"
								}, {
								  "adcode": 210624,
								  "cityCode": 210600,
								  "name": "宽甸满族自治县"
								}, {
								  "adcode": 210681,
								  "cityCode": 210600,
								  "name": "东港市"
								}, {
								  "adcode": 210682,
								  "cityCode": 210600,
								  "name": "凤城市"
								}],
								"210500":[{
									"adcode": 210502,
									"cityCode": 210500,
									"name": "平山区",
								  }, {
									"adcode": 210503,
									"cityCode": 210500,
									"name": "溪湖区",
								  }, {
									"adcode": 210504,
									"cityCode": 210500,
									"name": "明山区"
								  }, {
									"adcode": 210505,
									"cityCode": 210500,
									"name": "南芬区"
								  }, {
									"adcode": 210521,
									"cityCode": 210500,
									"name": "本溪满族自治县"
								  }, {
									"adcode": 210522,
									"cityCode": 210500,
									"name": "桓仁满族自治县"
								  }],
								  "210400":[{
										"adcode": 210402,
										"cityCode": 210400,
										"name": "新抚区"
									  }, {
										"adcode": 210403,
										"cityCode": 210400,
										"name": "东洲区"
									  }, {
										"adcode": 210404,
										"cityCode": 210400,
										"name": "望花区"
									  }, {
										"adcode": 210411,
										"cityCode": 210400,
										"name": "顺城区"
									  }, {
										"adcode": 210421,
										"cityCode": 210400,
										"name": "抚顺县"
									  }, {
										"adcode": 210422,
										"cityCode": 210400,
										"name": "新宾满族自治县"
									  }, {
										"adcode": 210423,
										"cityCode": 210400,
										"name": "清原满族自治县"
									  }],
									  "210300":[{
										  "adcode": 210302,
										  "cityCode": 210300,
										  "name": "铁东区"
										}, {
										  "adcode": 210303,
										  "cityCode": 210300,
										  "name": "铁西区"
										}, {
										  "adcode": 210304,
										  "cityCode": 210300,
										  "name": "立山区"
										}, {
										  "adcode": 210311,
										  "cityCode": 210300,
										  "name": "千山区"
										}, {
										  "adcode": 210321,
										  "cityCode": 210300,
										  "name": "台安县"
										}, {
										  "adcode": 210323,
										  "cityCode": 210300,
										  "name": "岫岩满族自治县"
										}, {
										  "adcode": 210381,
										  "cityCode": 210300,
										  "name": "海城市"
										}],
										"210200":[{
											"adcode": 210202,
											"cityCode": 210200,
											"name": "中山区"
										  }, {
											"adcode": 210203,
											"cityCode": 210200,
											"name": "西岗区"
										  }, {
											"adcode": 210204,
											"cityCode": 210200,
											"name": "沙河口区"
										  }, {
											"adcode": 210211,
											"cityCode": 210200,
											"name": "甘井子区"
										  }, {
											"adcode": 210212,
											"cityCode": 210200,
											"name": "旅顺口区"
										  }, {
											"adcode": 210213,
											"cityCode": 210200,
											"name": "金州区"
										  }, {
											"adcode": 210214,
											"cityCode": 210200,
											"name": "普兰店区"
										  }, {
											"adcode": 210224,
											"cityCode": 210200,
											"name": "长海县"
										  }, {
											"adcode": 210281,
											"cityCode": 210200,
											"name": "瓦房店市"
										  }, {
											"adcode": 210283,
											"cityCode": 210200,
											"name": "庄河市"
										  }],
										  "210100":[{
											"adcode": 210102,
											"cityCode": 210100,
											"name": "和平区"
										  }, {
											"adcode": 210103,
											"cityCode": 210100,
											"name": "沈河区"
										  }, {
											"adcode": 210104,
											"cityCode": 210100,
											"name": "大东区"
										  }, {
											"adcode": 210105,
											"cityCode": 210100,
											"name": "皇姑区"
										  }, {
											"adcode": 210106,
											"cityCode": 210100,
											"name": "铁西区"
										  }, {
											"adcode": 210111,
											"cityCode": 210100,
											"name": "苏家屯区"
										  }, {
											"adcode": 210112,
											"cityCode": 210100,
											"name": "浑南区"
										  }, {
											"adcode": 210113,
											"cityCode": 210100,
											"name": "沈北新区"
										  }, {
											"adcode": 210114,
											"cityCode": 210100,
											"name": "于洪区"
										  }, {
											"adcode": 210115,
											"cityCode": 210100,
											"name": "辽中区"
										  }, {
											"adcode": 210123,
											"cityCode": 210100,
											"name": "康平县"
										  }, {
											"adcode": 210124,
											"cityCode": 210100,
											"name": "法库县",
										  }, {
											"adcode": 210181,
											"cityCode": 210100,
											"name": "新民市"
										  }],
			"210000":[
				{"adcode":210100,"cityCode":210000,"name":"沈阳市"},
				{"adcode":210200,"cityCode":210000,"name":"大连市"},
				{"adcode":210300,"cityCode":210000,"name":"鞍山市"},
				{"adcode":210400,"cityCode":210000,"name":"抚顺市"},
				{"adcode":210500,"cityCode":210000,"name":"本溪市"},
				{"adcode":210600,"cityCode":210000,"name":"丹东市"},
				{"adcode":210700,"cityCode":210000,"name":"锦州市"},
				{"adcode":210800,"cityCode":210000,"name":"营口市"},
				{"adcode":210900,"cityCode":210000,"name":"阜新市"},
				{"adcode":211000,"cityCode":210000,"name":"辽阳市"},
				{"adcode":211100,"cityCode":210000,"name":"盘锦市"},
				{"adcode":211200,"cityCode":210000,"name":"铁岭市"},
				{"adcode":211300,"cityCode":210000,"name":"朝阳市"},
				{"adcode":211400,"cityCode":210000,"name":"葫芦岛市"},
				{"adcode":210000,"cityCode":210000,"name":"辽宁省"}
			]
		}

	},
	created:function(){
		this.getIndicatorInfo(this.province);
		
		
	},
	
	methods: {
		analyseEX097:function(ex097){
			var sArr = ex097.split('|');
			var len = sArr.length;
			if(len> 1) this.cover_count	               = sArr[0];
			if(len> 2) this.onu_port	                   = sArr[1];
			if(len> 3) this.onu_used_port	               = sArr[2];
			if(len> 4) this.cover_rate	           = sArr[3];
			if(len> 5) this.port_cover_rate	           = sArr[4];
			if(len> 6) this.cell_user_rate	       = sArr[5];
			if(len> 7) this.pos_user_rate	           = sArr[6];
			if(len> 8) this.home_cnt	       = sArr[7];
			if(len> 9) this.home_light_cnt	       = sArr[8];
			if(len> 10) this.r_new_dk_cnt	       = sArr[9];
			if(len> 11) this.r_new_fuse_cnt	           = sArr[10];
			if(len> 12) this.r_new_100_cnt	       = sArr[11];
			if(len> 13) this.r_new_100_200_cnt	       = sArr[12];
			if(len> 14) this.r_new_200_cnt	       = sArr[13];
			if(len> 15) this.r_new_cnt	       = sArr[14];
			if(len> 16) this.y_new_dk_cnt	   = sArr[15];
			if(len> 17) this.y_new_fuse_cnt	       = sArr[16];
			if(len> 18) this.y_new_100_cnt	           = sArr[17];
			if(len> 19) this.y_new_100_200_cnt	       = sArr[18];
			if(len> 20) this.y_new_200_cnt        = sArr[19];
			if(len> 21) this.y_new_cnt	       = sArr[20];
			if(len> 22) this.n_new_dk_cnt	   = sArr[21];
			if(len> 23) this.n_new_fuse_cnt	       = sArr[22];
			if(len> 24) this.n_new_100_cnt	           = sArr[23];
			if(len> 25) this.n_new_100_200_cnt	       = sArr[24];
			if(len> 26) this.n_new_200_cnt	       = sArr[25];
			if(len> 27) this.n_new_cnt	       = sArr[26];
			if(len> 28) this.dd_dk_cnt	   = sArr[27];
			if(len> 29) this.dd_fuse_cnt	       = sArr[28];
			if(len> 30) this.dd_20_cnt	           = sArr[29];
			if(len> 31) this.dd_20_50_cnt	           = sArr[30];
			if(len> 32) this.dd_50_100_cnt	       = sArr[31];
			if(len> 33) this.dd_100_200_cnt             = sArr[32];
			if(len> 34) this.dd_200_cnt	       = sArr[33];
			if(len> 35) this.dd_home_cnt	       = sArr[34];
			if(len> 36) this.dd_act_cnt	       = sArr[35];
			if(len> 37) this.act_rate	           = sArr[36];
			if(len> 38) this.pj_act_rate	       = sArr[37];
			if(len> 39) this.new_100_rate	           = sArr[38];
			if(len> 40) this.dd_100_rate	           = sArr[39];
			if(len> 41) this.new_fuse_rate	       = sArr[40];
			if(len> 42) this.dd_fuse_rate	       = sArr[41];
			if(len> 43) this.new_kd_should_fee	       = sArr[42];
			if(len> 44) this.new_ft_fee	       = sArr[43];
			if(len> 45) this.new_arpu	       = sArr[44];
			if(len> 46) this.kd_should_fee	   = sArr[45];
			if(len> 47) this.ft_fee	           = sArr[46];
			if(len> 48) this.arpu	           = sArr[47];
			if(len> 49) this.mbh_cnt	       = sArr[48];
			if(len> 50) this.mbh_st_rate	   = sArr[49];
			if(len> 51) this.d_mbh_new_cnt	   = sArr[50];
			if(len> 52) this.y_mbh_new_cnt	           = sArr[51];
			if(len> 53) this.y_jj_mbh_cnt	       = sArr[52];
			if(len> 54) this.n_jj_mbh_cnt         = sArr[53];
			if(len> 55) this.mbh_activation_rate         = sArr[54];
			if(len> 56) this.y_mbh_activation_rate          = sArr[55];
			if(len> 57) this.mbh_active_rate          = sArr[56];
			if(len> 58) this.mbh_fee   = sArr[57];
			if(len> 59) this.lj_mbh_fee = sArr[58];
			if(len> 60) this.hemu_cnt	   = sArr[59];
			if(len> 61) this.hemu_new_cnt	           = sArr[60];
			if(len> 62) this.tel_cnt	           = sArr[61];
			if(len> 63) this.tel_new_cnt	           = sArr[62];

			if(len> 64) this.y_lw_cnt	       = sArr[63];
			if(len> 65) this.lw_rate	       = sArr[64];
		},
		handleTabClick:function(status){
			this.status = status;
		if(this.status == 3){
		   this.isshowchart = false;
		} else {
		   this.isshowchart = true;
		}
		var current_tap_now = this.current_tap
			
			
		if(status == 1){
			this.featureClick({
				properties:{
					name:this.province,
					adcode:this.provincecode
				}
			});
		   
			this.getIndicatorInfo(this.province);//更新面板数据
		    this.createPieCharts(this.province, this.current_tap);//更新饼状图     
		} else if(status == 2&&this.city !==''){
			 this.featureClick({
				properties:{
					name:this.city,
					adcode:this.cityCode
				}
			});
			this.getIndicatorInfo(this.city);
			this.createPieCharts(this.city, this.current_tap);

		} else if(status == 3&&this.district !==''){
		  if(this.house !==''){
			  //绘制小区区域

		  } else {
			this.featureClick({
				properties:{
					name:this.district,
					adcode:this.districtcode
				}
			});
		  }

		}
		},
		getIndicatorInfo:function(keyword){
			var this$1 = this;
			getInfo(keyword,function(status, result){
					if(status != 'complete') {
						this$1.toast('调用失败！错误信息：' + (result || '（空）'));
						return;
					}
					var pois = result.pois;
					if(!pois||pois.length ==0||!pois[0]['EX097']) {
						this$1.toast('数据不存在');
						return;
					}
					this$1.analyseEX097(pois[0]['EX097']);
			});
		},
		toast:function(msg){
			var this$1 = this;
			this$1.istoast = true;
			this$1.toastmsg = msg;
			setTimeout(function () {
				 this$1.istoast = false;
			  }, 1000);
		},
		statuspuls:function(feature){
		if(this.status>=3)
		  return;
		 this.status ++;
		
		 if(this.status == 2){
			  this.cityCode = feature.properties.adcode;
			  this.city = feature.properties.name;
		 } else if(this.status == 3){
			  this.districtcode = feature.properties.adcode;
			  this.district = feature.properties.name;
			  	
		 }
	  },
		featureClick:function(feature,updatestatus){
			if(typeof(updatestatus) !=="undefined"&&updatestatus){
				this.statuspuls(feature);
			}
		
			this.getIndicatorInfo(feature.properties.name);
			 this.createPieCharts(feature.properties.name, this.current_tap);
			if(this.status == 3){
			  //获取小区面
			   this.isshowchart = false;
			} else {
				loadAreaNode(feature.properties.adcode);
			  
			   
			}

		},
		searchHourse:function(){
			  this.getHouseInfo(this.house,this.districtcode);
		},
		analyEX033:function(distinctXys){
				var disArr = distinctXys.split(" ");
				var gonArr = [];
				for(var j = 0; j < disArr.length; j++) {
				  var lnglat = disArr[j].split(";");

				  for(var k = 0; k < lnglat.length; k++) {
					var longitude = lnglat[k].split("|")[0];
					var latitude = lnglat[k].split("|")[1];
					var temp = { lng: longitude, lat: latitude };
					gonArr.push(temp);
				  }
				}
				  renderHourse(gonArr);
		},
		getHouseInfo:function(name,adcode){
		  var this$1 = this;
		  this.getIndicatorInfo(name);
		  adcode = adcode||this.districtcode;
		  getAreaInfo(name,adcode,function(status, result){
					if(status != 'complete') {
						this$1.toast('调用失败！错误信息：' + (result || '（空）'));
						return;
					}
					var pois = result.pois;
					if(!pois||pois.length ==0||!pois[0]['EX033']) {
						this$1.toast('数据不存在');
						return;
					}
					this$1.analyEX033(pois[0]['EX033']);
		  });
	  },
		initlistener:function(){
			var this$1 = this;
	
			  new SelectFx(document.getElementById('sel_city'),{
				onChange:function(value){
				  var el = document.getElementById('sel_city');
				  var index=el.selectedIndex; 
				  var text = el.options[index].text;
				  this$1.city = text;
				  this$1.cityCode = value;
				  this$1.district = this$1.distdetails[value][0].name;
				  this$1.districtcode = this$1.distdetails[value][0].adcode;

				  this$1.$nextTick(function () {
					 distSelFx.update();
				  });
				}
			  });
			 distSelFx =  new SelectFx(document.getElementById('sel_dist'),{
				onChange:function(value){
				   var el = document.getElementById('sel_dist');
				  var index=el.selectedIndex; 
				  var text = el.options[index].text;
				  this$1.district = text;
				  this$1.districtcode = value;
				}
			  });
		},
		changePie:function(item_index){
		  this.current_tap = item_index;
		 if(this.status == 1){
			 this.createPieCharts(this.province,item_index);
		  }else if(this.status == 2){
			   this.createPieCharts(this.city,item_index);
		  }else{
			  
		  }
		},
		createPieCharts:function(bigger_name,current_tap_now){
			var this$1 = this;
	        console.log('enter la');
			console.log(bigger_name+current_tap_now);
			var tap = current_tap_now.toLowerCase();
			var array = this.distdetails;
			console.log(array);
			var bigger_cityCode ='';
			var smaller_cities = [];
			var data = new Array();
			$.each(array,function(index,element){
				$.each(element,function(i,e){
					if(e.name == bigger_name)
					{
						bigger_cityCode =e.cityCode;
					}
				})
			});
			console.log(bigger_cityCode);
			$.each(array,function(index,element){
				if(index ==bigger_cityCode){
					$.each(element,function(i,e){
						smaller_cities.push({name:e.name,value:100});
					})
				}
			});
			console.log(smaller_cities);
			$.each(smaller_cities,function(index,elements){
				//console.log(elements);
				getInfo(elements.name,function(status, result){
					if(status != 'complete') {
						this$1.toast('调用失败！错误信息：' + (result || '（空）'));
						return;
					}
				   // console.log(element);
					var pois = result.pois;
					if(!pois||pois.length ==0||!pois[0]['EX097']) {
						this$1.toast('数据不存在ya ');
						return;
					}
					
					var sArr = pois[0]['EX097'].split('|');
			        var len = sArr.length;
					
					if(len> 1)  elements.cover_count	               = sArr[0];
					if(len> 2)  elements.onu_port	                   = sArr[1];
					if(len> 3)  elements.onu_used_port	               = sArr[2];
					if(len> 4)  elements.cover_rate	           = sArr[3];
					if(len> 5)  elements.port_cover_rate	           = sArr[4];
					if(len> 6)  elements.cell_user_rate	       = sArr[5];
					if(len> 7)  elements.pos_user_rate	           = sArr[6];
					if(len> 8)  elements.home_cnt	       = sArr[7];
					if(len> 9)  elements.home_light_cnt	       = sArr[8];
					if(len> 10) elements.r_new_dk_cnt	       = sArr[9];
					if(len> 11) elements.r_new_fuse_cnt	           = sArr[10];
					if(len> 12) elements.r_new_100_cnt	       = sArr[11];
					if(len> 13) elements.r_new_100_200_cnt	       = sArr[12];
					if(len> 14) elements.r_new_200_cnt	       = sArr[13];
					if(len> 15) elements.r_new_cnt	       = sArr[14];
					if(len> 16) elements.y_new_dk_cnt	   = sArr[15];
					if(len> 17) elements.y_new_fuse_cnt	       = sArr[16];
					if(len> 18) elements.y_new_100_cnt	           = sArr[17];
					if(len> 19) elements.y_new_100_200_cnt	       = sArr[18];
					if(len> 20) elements.y_new_200_cnt        = sArr[19];
					if(len> 21) elements.y_new_cnt	       = sArr[20];
					if(len> 22) elements.n_new_dk_cnt	   = sArr[21];
					if(len> 23) elements.n_new_fuse_cnt	       = sArr[22];
					if(len> 24) elements.n_new_100_cnt	           = sArr[23];
					if(len> 25) elements.n_new_100_200_cnt	       = sArr[24];
					if(len> 26) elements.n_new_200_cnt	       = sArr[25];
					if(len> 27) elements.n_new_cnt	       = sArr[26];
					if(len> 28) elements.dd_dk_cnt	   = sArr[27];
					if(len> 29) elements.dd_fuse_cnt	       = sArr[28];
					if(len> 30) elements.dd_20_cnt	           = sArr[29];
					if(len> 31) elements.dd_20_50_cnt	           = sArr[30];
					if(len> 32) elements.dd_50_100_cnt	       = sArr[31];
					if(len> 33) elements.dd_100_200_cnt             = sArr[32];
					if(len> 34) elements.dd_200_cnt	       = sArr[33];
					if(len> 35) elements.dd_home_cnt	       = sArr[34];
					if(len> 36) elements.dd_act_cnt	       = sArr[35];
					if(len> 37) elements.act_rate	           = sArr[36];
					if(len> 38) elements.pj_act_rate	       = sArr[37];
					if(len> 39) elements.new_100_rate	           = sArr[38];
					if(len> 40) elements.dd_100_rate	           = sArr[39];
					if(len> 41) elements.new_fuse_rate	       = sArr[40];
					if(len> 42) elements.dd_fuse_rate	       = sArr[41];
					if(len> 43) elements.new_kd_should_fee	       = sArr[42];
					if(len> 44) elements.new_ft_fee	       = sArr[43];
					if(len> 45) elements.new_arpu	       = sArr[44];
					if(len> 46) elements.kd_should_fee	   = sArr[45];
					if(len> 47) elements.ft_fee	           = sArr[46];
					if(len> 48) elements.arpu	           = sArr[47];
					if(len> 49) elements.mbh_cnt	       = sArr[48];
					if(len> 50) elements.mbh_st_rate	   = sArr[49];
					if(len> 51) elements.d_mbh_new_cnt	   = sArr[50];
					if(len> 52) elements.y_mbh_new_cnt	           = sArr[51];
					if(len> 53) elements.y_jj_mbh_cnt	       = sArr[52];
					if(len> 54) elements.n_jj_mbh_cnt         = sArr[53];
					if(len> 55) elements.mbh_activation_rate         = sArr[54];
					if(len> 56) elements.y_mbh_activation_rate          = sArr[55];
					if(len> 57) elements.mbh_active_rate          = sArr[56];
					if(len> 58) elements.mbh_fee   = sArr[57];
					if(len> 59) elements.lj_mbh_fee = sArr[58];
					if(len> 60) elements.hemu_cnt	   = sArr[59];
					if(len> 61) elements.hemu_new_cnt	           = sArr[60];
					if(len> 62) elements.tel_cnt	           = sArr[61];
					if(len> 63) elements.tel_new_cnt	           = sArr[62];
					if(len> 64) elements.y_lw_cnt	       = sArr[63];
					if(len> 65) elements.lw_rate	       = sArr[64];
			        data.push(elements);
				
					var dom = document.getElementById("chartContent");
			var myChart = echarts.init(dom);
			var app = {};
			option = null;
			option = {
				tooltip:{},
				visualMap: {
					// 不显示 visualMap 组件，只用于明暗度的映射
					show: false,
					// 映射的最小值为 80
					min: 80,
					// 映射的最大值为 600
					max: 600,
					inRange: {
						// 明暗度的范围是 0 到 1
						colorLightness: [0, 1]
					}
				},
				series : [
					{
						name: '占比分析',
						type: 'pie',
						radius: '60%',
						label: {
							normal: {
								formatter: '{b|{b}}\n {per|{d}%}  ',
								backgroundColor: 'transparent',
								borderWidth: 1,
								borderRadius: 4,
								// shadowBlur:3,
								// shadowOffsetX: 2,
								// shadowOffsetY: 2,
								// shadowColor: '#999',
								// padding: [0, 7],
								rich: {
								   
									hr: {
										borderColor: '#aaa',
										width: '100%',
										borderWidth: 0.5,
										height: 0
									},
									b: {
										fontSize: 16,
										lineHeight: 33
									},
									per: {
										color: '#fff',
										padding: [2, 4],
									}
								}
							}
						},
						data:data.map(function(item,index){
							for(var init_item in item){
								if(init_item == tap){
									if(item['name'] =='辽宁省'){
										
									}else{
								        return {name:item.name,value:item[init_item]};
									}
								}
								else{
								   
								}
							} 
							
						
							
						}) 
					}
				]
			};
			myChart.setOption(option, true);
			if (option && typeof option === "object") {
				myChart.setOption(option, true);
			}
				
				
				
				
				
				
				});
			})
			
			// data = [{name: "沈阳市", 'value': 100, cover_count: "3485448", onu_port: "1989515", onu_used_port: "816235"},
							// {name: "沈阳市", 'value': 100, cover_count: "3485448", onu_port: "1989515", onu_used_port: "816235"},
						// {name: "本溪市", 'value': 100, cover_count: "630065", onu_port: "338962", onu_used_port: "162838"}];
			
		
		},
		changeCell:function(cell){
			//console.log(cell);
			var this$1 = this;
			//console.log(this$1.bool_arr.bool);
			this.current_cell = cell;
			switch(cell){
				case '覆盖与实装率':{
					 this$1.bool_arr.bool_type                               =false;	
					 this$1.bool_arr.bool_id                                 =false;
					 this$1.bool_arr.bool_name                               =false;
					 this$1.bool_arr.bool_cover_count                        =true;  
					 this$1.bool_arr.bool_onu_port                           =true;
					 this$1.bool_arr.bool_onu_used_port                      =true;
					 this$1.bool_arr.bool_cover_rate                         =true;
					 this$1.bool_arr.bool_port_cover_rate                    =true;  
					 this$1.bool_arr.bool_cell_user_rate                     =true;
					 this$1.bool_arr.bool_pos_user_rate                      =true;
					 this$1.bool_arr.bool_home_cnt                           =true;
					 this$1.bool_arr.bool_home_light_cnt                     =true;
					 this$1.bool_arr.bool_r_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_r_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_r_new_100_cnt                      =false;
					 this$1.bool_arr.bool_r_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_r_new_200_cnt                      =false;
					 this$1.bool_arr.bool_r_new_cnt                          =false;
					 this$1.bool_arr.bool_y_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_y_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_y_new_100_cnt                      =false;
					 this$1.bool_arr.bool_y_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_y_new_200_cnt                      =false;
					 this$1.bool_arr.bool_y_new_cnt                          =false;
					 this$1.bool_arr.bool_n_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_n_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_n_new_100_cnt                      =false;
					 this$1.bool_arr.bool_n_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_n_new_200_cnt                      =false;
					 this$1.bool_arr.bool_n_new_cnt                          =false;
					 this$1.bool_arr.bool_dd_dk_cnt                          =false;
					 this$1.bool_arr.bool_dd_fuse_cnt                        =false;
					 this$1.bool_arr.bool_dd_20_cnt                          =false;
					 this$1.bool_arr.bool_dd_20_50_cnt                       =false;
					 this$1.bool_arr.bool_dd_50_100_cnt                      =false;
					 this$1.bool_arr.bool_dd_100_200_cnt                     =false;
					 this$1.bool_arr.bool_dd_200_cnt                         =false;
					 this$1.bool_arr.bool_dd_home_cnt                        =false;
					 this$1.bool_arr.bool_dd_act_cnt                         =false;
					 this$1.bool_arr.bool_act_rate                           =false;
					 this$1.bool_arr.bool_pj_act_rate                        =false;
					 this$1.bool_arr.bool_new_100_rate                       =false;
					 this$1.bool_arr.bool_dd_100_rate                        =false;
					 this$1.bool_arr.bool_new_fuse_rate                      =false;
					 this$1.bool_arr.bool_dd_fuse_rate                       =false;
					 this$1.bool_arr.bool_new_kd_should_fee                  =false;
					 this$1.bool_arr.bool_new_ft_fee                         =false;
					 this$1.bool_arr.bool_new_arpu                           =false;
					 this$1.bool_arr.bool_kd_should_fee                      =false;
					 this$1.bool_arr.bool_ft_fee                             =false;
					 this$1.bool_arr.bool_arpu                               =false;
					 this$1.bool_arr.bool_mbh_cnt                            =false;
					 this$1.bool_arr.bool_mbh_st_rate                        =false;
					 this$1.bool_arr.bool_d_mbh_new_cnt                      =false;
					 this$1.bool_arr.bool_y_mbh_new_cnt                      =false;
					 this$1.bool_arr.bool_y_jj_mbh_cnt                       =false;
					 this$1.bool_arr.bool_n_jj_mbh_cnt                       =false;
					 this$1.bool_arr.bool_mbh_activation_rate                =false;
					 this$1.bool_arr.bool_y_mbh_activation_rate              =false;
					 this$1.bool_arr.bool_mbh_active_rate                    =false;
					 this$1.bool_arr.bool_mbh_fee                            =false;
					 this$1.bool_arr.bool_lj_mbh_fee                         =false;
					 this$1.bool_arr.bool_hemu_cnt                           =false;
					 this$1.bool_arr.bool_hemu_new_cnt                       =false;
					 this$1.bool_arr.bool_tel_cnt                            =false;
					 this$1.bool_arr.bool_tel_new_cnt                        =false;
					 this$1.bool_arr.bool_y_lw_cnt                           =false;
					 this$1.bool_arr.bool_lw_rate                            =false;
					 this$1.bool_arr.bool_dd_off_cnt                         =false;
					 this$1.bool_arr.bool_port_conver_rate                   =false;
							 
					 
					break;   
				}            
				case '宽带电视':{
					 this$1.bool_arr.bool_type                               =false;	
					 this$1.bool_arr.bool_id                                 =false;
					 this$1.bool_arr.bool_name                               =false;
					 this$1.bool_arr.bool_cover_count                        =false;  
					 this$1.bool_arr.bool_onu_port                           =false;
					 this$1.bool_arr.bool_onu_used_port                      =false;
					 this$1.bool_arr.bool_cover_rate                         =false;
					 this$1.bool_arr.bool_port_cover_rate                    =false;  
					 this$1.bool_arr.bool_cell_user_rate                     =false;
					 this$1.bool_arr.bool_pos_user_rate                      =false;
					 this$1.bool_arr.bool_home_cnt                           =false;
					 this$1.bool_arr.bool_home_light_cnt                     =false;
					 this$1.bool_arr.bool_r_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_r_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_r_new_100_cnt                      =false;
					 this$1.bool_arr.bool_r_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_r_new_200_cnt                      =false;
					 this$1.bool_arr.bool_r_new_cnt                          =false;
					 this$1.bool_arr.bool_y_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_y_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_y_new_100_cnt                      =false;
					 this$1.bool_arr.bool_y_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_y_new_200_cnt                      =false;
					 this$1.bool_arr.bool_y_new_cnt                          =false;
					 this$1.bool_arr.bool_n_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_n_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_n_new_100_cnt                      =false;
					 this$1.bool_arr.bool_n_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_n_new_200_cnt                      =false;
					 this$1.bool_arr.bool_n_new_cnt                          =false;
					 this$1.bool_arr.bool_dd_dk_cnt                          =false;
					 this$1.bool_arr.bool_dd_fuse_cnt                        =false;
					 this$1.bool_arr.bool_dd_20_cnt                          =false;
					 this$1.bool_arr.bool_dd_20_50_cnt                       =false;
					 this$1.bool_arr.bool_dd_50_100_cnt                      =false;
					 this$1.bool_arr.bool_dd_100_200_cnt                     =false;
					 this$1.bool_arr.bool_dd_200_cnt                         =false;
					 this$1.bool_arr.bool_dd_home_cnt                        =false;
					 this$1.bool_arr.bool_dd_act_cnt                         =false;
					 this$1.bool_arr.bool_act_rate                           =false;
					 this$1.bool_arr.bool_pj_act_rate                        =false;
					 this$1.bool_arr.bool_new_100_rate                       =false;
					 this$1.bool_arr.bool_dd_100_rate                        =false;
					 this$1.bool_arr.bool_new_fuse_rate                      =false;
					 this$1.bool_arr.bool_dd_fuse_rate                       =false;
					 this$1.bool_arr.bool_new_kd_should_fee                  =false;
					 this$1.bool_arr.bool_new_ft_fee                         =false;
					 this$1.bool_arr.bool_new_arpu                           =false;
					 this$1.bool_arr.bool_kd_should_fee                      =false;
					 this$1.bool_arr.bool_ft_fee                             =false;
					 this$1.bool_arr.bool_arpu                               =false;
					 this$1.bool_arr.bool_mbh_cnt                            =true;
					 this$1.bool_arr.bool_mbh_st_rate                        =true;
					 this$1.bool_arr.bool_d_mbh_new_cnt                      =true;
					 this$1.bool_arr.bool_y_mbh_new_cnt                      =true;
					 this$1.bool_arr.bool_y_jj_mbh_cnt                       =true;
					 this$1.bool_arr.bool_n_jj_mbh_cnt                       =true;
					 this$1.bool_arr.bool_mbh_activation_rate                =true;
					 this$1.bool_arr.bool_y_mbh_activation_rate              =true;
					 this$1.bool_arr.bool_mbh_active_rate                    =true;
					 this$1.bool_arr.bool_mbh_fee                            =true;
					 this$1.bool_arr.bool_lj_mbh_fee                         =true;
					 this$1.bool_arr.bool_hemu_cnt                           =false;
					 this$1.bool_arr.bool_hemu_new_cnt                       =false;
					 this$1.bool_arr.bool_tel_cnt                            =false;
					 this$1.bool_arr.bool_tel_new_cnt                        =false;
					 this$1.bool_arr.bool_y_lw_cnt                           =false;
					 this$1.bool_arr.bool_lw_rate                            =false;
					 this$1.bool_arr.bool_dd_off_cnt                         =false;
					 this$1.bool_arr.bool_port_conver_rate                   =false;
					break;
				}
				case '客户数':{
					this$1.bool_arr.bool_type                               =false;	
					 this$1.bool_arr.bool_id                                 =false;
					 this$1.bool_arr.bool_name                               =false;
					 this$1.bool_arr.bool_cover_count                        =false;  
					 this$1.bool_arr.bool_onu_port                           =false;
					 this$1.bool_arr.bool_onu_used_port                      =false;
					 this$1.bool_arr.bool_cover_rate                         =false;
					 this$1.bool_arr.bool_port_cover_rate                    =false;  
					 this$1.bool_arr.bool_cell_user_rate                     =false;
					 this$1.bool_arr.bool_pos_user_rate                      =false;
					 this$1.bool_arr.bool_home_cnt                           =false;
					 this$1.bool_arr.bool_home_light_cnt                     =false;
					 this$1.bool_arr.bool_r_new_dk_cnt                       =true;
					 this$1.bool_arr.bool_r_new_fuse_cnt                     =true;
					 this$1.bool_arr.bool_r_new_100_cnt                      =true;
					 this$1.bool_arr.bool_r_new_100_200_cnt                  =true;
					 this$1.bool_arr.bool_r_new_200_cnt                      =true;
					 this$1.bool_arr.bool_r_new_cnt                          =true;
					 this$1.bool_arr.bool_y_new_dk_cnt                       =true;
					 this$1.bool_arr.bool_y_new_fuse_cnt                     =true;
					 this$1.bool_arr.bool_y_new_100_cnt                      =true;
					 this$1.bool_arr.bool_y_new_100_200_cnt                  =true;
					 this$1.bool_arr.bool_y_new_200_cnt                      =true;
					 this$1.bool_arr.bool_y_new_cnt                          =true;
					 this$1.bool_arr.bool_n_new_dk_cnt                       =true;
					 this$1.bool_arr.bool_n_new_fuse_cnt                     =true;
					 this$1.bool_arr.bool_n_new_100_cnt                      =true;
					 this$1.bool_arr.bool_n_new_100_200_cnt                  =true;
					 this$1.bool_arr.bool_n_new_200_cnt                      =true;
					 this$1.bool_arr.bool_n_new_cnt                          =true;
					 this$1.bool_arr.bool_dd_dk_cnt                          =false;
					 this$1.bool_arr.bool_dd_fuse_cnt                        =false;
					 this$1.bool_arr.bool_dd_20_cnt                          =false;
					 this$1.bool_arr.bool_dd_20_50_cnt                       =false;
					 this$1.bool_arr.bool_dd_50_100_cnt                      =false;
					 this$1.bool_arr.bool_dd_100_200_cnt                     =false;
					 this$1.bool_arr.bool_dd_200_cnt                         =false;
					 this$1.bool_arr.bool_dd_home_cnt                        =false;
					 this$1.bool_arr.bool_dd_act_cnt                         =false;
					 this$1.bool_arr.bool_act_rate                           =false;
					 this$1.bool_arr.bool_pj_act_rate                        =false;
					 this$1.bool_arr.bool_new_100_rate                       =false;
					 this$1.bool_arr.bool_dd_100_rate                        =false;
					 this$1.bool_arr.bool_new_fuse_rate                      =false;
					 this$1.bool_arr.bool_dd_fuse_rate                       =false;
					 this$1.bool_arr.bool_new_kd_should_fee                  =false;
					 this$1.bool_arr.bool_new_ft_fee                         =false;
					 this$1.bool_arr.bool_new_arpu                           =false;
					 this$1.bool_arr.bool_kd_should_fee                      =false;
					 this$1.bool_arr.bool_ft_fee                             =false;
					 this$1.bool_arr.bool_arpu                               =false;
					 this$1.bool_arr.bool_mbh_cnt                            =false;
					 this$1.bool_arr.bool_mbh_st_rate                        =false;
					 this$1.bool_arr.bool_d_mbh_new_cnt                      =false;
					 this$1.bool_arr.bool_y_mbh_new_cnt                      =false;
					 this$1.bool_arr.bool_y_jj_mbh_cnt                       =false;
					 this$1.bool_arr.bool_n_jj_mbh_cnt                       =false;
					 this$1.bool_arr.bool_mbh_activation_rate                =false;
					 this$1.bool_arr.bool_y_mbh_activation_rate              =false;
					 this$1.bool_arr.bool_mbh_active_rate                    =false;
					 this$1.bool_arr.bool_mbh_fee                            =false;
					 this$1.bool_arr.bool_lj_mbh_fee                         =false;
					 this$1.bool_arr.bool_hemu_cnt                           =false;
					 this$1.bool_arr.bool_hemu_new_cnt                       =false;
					 this$1.bool_arr.bool_tel_cnt                            =false;
					 this$1.bool_arr.bool_tel_new_cnt                        =false;
					 this$1.bool_arr.bool_y_lw_cnt                           =false;
					 this$1.bool_arr.bool_lw_rate                            =false;
					 this$1.bool_arr.bool_dd_off_cnt                         =false;
					 this$1.bool_arr.bool_port_conver_rate                   =false;
					break;
				}
				case '增值产品':{
					this$1.bool_arr.bool_type                               =false;	
					 this$1.bool_arr.bool_id                                 =false;
					 this$1.bool_arr.bool_name                               =false;
					 this$1.bool_arr.bool_cover_count                        =false;  
					 this$1.bool_arr.bool_onu_port                           =false;
					 this$1.bool_arr.bool_onu_used_port                      =false;
					 this$1.bool_arr.bool_cover_rate                         =false;
					 this$1.bool_arr.bool_port_cover_rate                    =false;  
					 this$1.bool_arr.bool_cell_user_rate                     =false;
					 this$1.bool_arr.bool_pos_user_rate                      =false;
					 this$1.bool_arr.bool_home_cnt                           =false;
					 this$1.bool_arr.bool_home_light_cnt                     =false;
					 this$1.bool_arr.bool_r_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_r_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_r_new_100_cnt                      =false;
					 this$1.bool_arr.bool_r_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_r_new_200_cnt                      =false;
					 this$1.bool_arr.bool_r_new_cnt                          =false;
					 this$1.bool_arr.bool_y_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_y_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_y_new_100_cnt                      =false;
					 this$1.bool_arr.bool_y_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_y_new_200_cnt                      =false;
					 this$1.bool_arr.bool_y_new_cnt                          =false;
					 this$1.bool_arr.bool_n_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_n_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_n_new_100_cnt                      =false;
					 this$1.bool_arr.bool_n_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_n_new_200_cnt                      =false;
					 this$1.bool_arr.bool_n_new_cnt                          =false;
					 this$1.bool_arr.bool_dd_dk_cnt                          =false;
					 this$1.bool_arr.bool_dd_fuse_cnt                        =false;
					 this$1.bool_arr.bool_dd_20_cnt                          =false;
					 this$1.bool_arr.bool_dd_20_50_cnt                       =false;
					 this$1.bool_arr.bool_dd_50_100_cnt                      =false;
					 this$1.bool_arr.bool_dd_100_200_cnt                     =false;
					 this$1.bool_arr.bool_dd_200_cnt                         =false;
					 this$1.bool_arr.bool_dd_home_cnt                        =false;
					 this$1.bool_arr.bool_dd_act_cnt                         =false;
					 this$1.bool_arr.bool_act_rate                           =false;
					 this$1.bool_arr.bool_pj_act_rate                        =false;
					 this$1.bool_arr.bool_new_100_rate                       =false;
					 this$1.bool_arr.bool_dd_100_rate                        =false;
					 this$1.bool_arr.bool_new_fuse_rate                      =false;
					 this$1.bool_arr.bool_dd_fuse_rate                       =false;
					 this$1.bool_arr.bool_new_kd_should_fee                  =false;
					 this$1.bool_arr.bool_new_ft_fee                         =false;
					 this$1.bool_arr.bool_new_arpu                           =false;
					 this$1.bool_arr.bool_kd_should_fee                      =false;
					 this$1.bool_arr.bool_ft_fee                             =false;
					 this$1.bool_arr.bool_arpu                               =false;
					 this$1.bool_arr.bool_mbh_cnt                            =false;
					 this$1.bool_arr.bool_mbh_st_rate                        =false;
					 this$1.bool_arr.bool_d_mbh_new_cnt                      =false;
					 this$1.bool_arr.bool_y_mbh_new_cnt                      =false;
					 this$1.bool_arr.bool_y_jj_mbh_cnt                       =false;
					 this$1.bool_arr.bool_n_jj_mbh_cnt                       =false;
					 this$1.bool_arr.bool_mbh_activation_rate                =false;
					 this$1.bool_arr.bool_y_mbh_activation_rate              =false;
					 this$1.bool_arr.bool_mbh_active_rate                    =false;
					 this$1.bool_arr.bool_mbh_fee                            =false;
					 this$1.bool_arr.bool_lj_mbh_fee                         =false;
					 this$1.bool_arr.bool_hemu_cnt                           =true;
					 this$1.bool_arr.bool_hemu_new_cnt                       =true;
					 this$1.bool_arr.bool_tel_cnt                            =true;
					 this$1.bool_arr.bool_tel_new_cnt                        =true;
					 this$1.bool_arr.bool_y_lw_cnt                           =false;
					 this$1.bool_arr.bool_lw_rate                            =false;
					 this$1.bool_arr.bool_dd_off_cnt                         =false;
					 this$1.bool_arr.bool_port_conver_rate                   =false;
					break;
				}
				case '收入':{
					this$1.bool_arr.bool_type                               =false;	
					 this$1.bool_arr.bool_id                                 =false;
					 this$1.bool_arr.bool_name                               =false;
					 this$1.bool_arr.bool_cover_count                        =false;  
					 this$1.bool_arr.bool_onu_port                           =false;
					 this$1.bool_arr.bool_onu_used_port                      =false;
					 this$1.bool_arr.bool_cover_rate                         =false;
					 this$1.bool_arr.bool_port_cover_rate                    =false;  
					 this$1.bool_arr.bool_cell_user_rate                     =false;
					 this$1.bool_arr.bool_pos_user_rate                      =false;
					 this$1.bool_arr.bool_home_cnt                           =false;
					 this$1.bool_arr.bool_home_light_cnt                     =false;
					 this$1.bool_arr.bool_r_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_r_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_r_new_100_cnt                      =false;
					 this$1.bool_arr.bool_r_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_r_new_200_cnt                      =false;
					 this$1.bool_arr.bool_r_new_cnt                          =false;
					 this$1.bool_arr.bool_y_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_y_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_y_new_100_cnt                      =false;
					 this$1.bool_arr.bool_y_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_y_new_200_cnt                      =false;
					 this$1.bool_arr.bool_y_new_cnt                          =false;
					 this$1.bool_arr.bool_n_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_n_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_n_new_100_cnt                      =false;
					 this$1.bool_arr.bool_n_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_n_new_200_cnt                      =false;
					 this$1.bool_arr.bool_n_new_cnt                          =false;
					 this$1.bool_arr.bool_dd_dk_cnt                          =false;
					 this$1.bool_arr.bool_dd_fuse_cnt                        =false;
					 this$1.bool_arr.bool_dd_20_cnt                          =false;
					 this$1.bool_arr.bool_dd_20_50_cnt                       =false;
					 this$1.bool_arr.bool_dd_50_100_cnt                      =false;
					 this$1.bool_arr.bool_dd_100_200_cnt                     =false;
					 this$1.bool_arr.bool_dd_200_cnt                         =false;
					 this$1.bool_arr.bool_dd_home_cnt                        =false;
					 this$1.bool_arr.bool_dd_act_cnt                         =false;
					 this$1.bool_arr.bool_act_rate                           =false;
					 this$1.bool_arr.bool_pj_act_rate                        =false;
					 this$1.bool_arr.bool_new_100_rate                       =false;
					 this$1.bool_arr.bool_dd_100_rate                        =false;
					 this$1.bool_arr.bool_new_fuse_rate                      =false;
					 this$1.bool_arr.bool_dd_fuse_rate                       =false;
					 this$1.bool_arr.bool_new_kd_should_fee                  =true;
					 this$1.bool_arr.bool_new_ft_fee                         =true;
					 this$1.bool_arr.bool_new_arpu                           =true;
					 this$1.bool_arr.bool_kd_should_fee                      =true;
					 this$1.bool_arr.bool_ft_fee                             =true;
					 this$1.bool_arr.bool_arpu                               =true;
					 this$1.bool_arr.bool_mbh_cnt                            =false;
					 this$1.bool_arr.bool_mbh_st_rate                        =false;
					 this$1.bool_arr.bool_d_mbh_new_cnt                      =false;
					 this$1.bool_arr.bool_y_mbh_new_cnt                      =false;
					 this$1.bool_arr.bool_y_jj_mbh_cnt                       =false;
					 this$1.bool_arr.bool_n_jj_mbh_cnt                       =false;
					 this$1.bool_arr.bool_mbh_activation_rate                =false;
					 this$1.bool_arr.bool_y_mbh_activation_rate              =false;
					 this$1.bool_arr.bool_mbh_active_rate                    =false;
					 this$1.bool_arr.bool_mbh_fee                            =true;
					 this$1.bool_arr.bool_lj_mbh_fee                         =true;
					 this$1.bool_arr.bool_hemu_cnt                           =false;
					 this$1.bool_arr.bool_hemu_new_cnt                       =false;
					 this$1.bool_arr.bool_tel_cnt                            =false;
					 this$1.bool_arr.bool_tel_new_cnt                        =false;
					 this$1.bool_arr.bool_y_lw_cnt                           =false;
					 this$1.bool_arr.bool_lw_rate                            =false;
					 this$1.bool_arr.bool_dd_off_cnt                         =false;
					 this$1.bool_arr.bool_port_conver_rate                   =false;
					break;
				}
				case '离网率':{
					this$1.bool_arr.bool_type                               =false;	
					 this$1.bool_arr.bool_id                                 =false;
					 this$1.bool_arr.bool_name                               =false;
					 this$1.bool_arr.bool_cover_count                        =false;  
					 this$1.bool_arr.bool_onu_port                           =false;
					 this$1.bool_arr.bool_onu_used_port                      =false;
					 this$1.bool_arr.bool_cover_rate                         =false;
					 this$1.bool_arr.bool_port_cover_rate                    =false;  
					 this$1.bool_arr.bool_cell_user_rate                     =false;
					 this$1.bool_arr.bool_pos_user_rate                      =false;
					 this$1.bool_arr.bool_home_cnt                           =false;
					 this$1.bool_arr.bool_home_light_cnt                     =false;
					 this$1.bool_arr.bool_r_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_r_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_r_new_100_cnt                      =false;
					 this$1.bool_arr.bool_r_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_r_new_200_cnt                      =false;
					 this$1.bool_arr.bool_r_new_cnt                          =false;
					 this$1.bool_arr.bool_y_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_y_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_y_new_100_cnt                      =false;
					 this$1.bool_arr.bool_y_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_y_new_200_cnt                      =false;
					 this$1.bool_arr.bool_y_new_cnt                          =false;
					 this$1.bool_arr.bool_n_new_dk_cnt                       =false;
					 this$1.bool_arr.bool_n_new_fuse_cnt                     =false;
					 this$1.bool_arr.bool_n_new_100_cnt                      =false;
					 this$1.bool_arr.bool_n_new_100_200_cnt                  =false;
					 this$1.bool_arr.bool_n_new_200_cnt                      =false;
					 this$1.bool_arr.bool_n_new_cnt                          =false;
					 this$1.bool_arr.bool_dd_dk_cnt                          =false;
					 this$1.bool_arr.bool_dd_fuse_cnt                        =false;
					 this$1.bool_arr.bool_dd_20_cnt                          =false;
					 this$1.bool_arr.bool_dd_20_50_cnt                       =false;
					 this$1.bool_arr.bool_dd_50_100_cnt                      =false;
					 this$1.bool_arr.bool_dd_100_200_cnt                     =false;
					 this$1.bool_arr.bool_dd_200_cnt                         =false;
					 this$1.bool_arr.bool_dd_home_cnt                        =false;
					 this$1.bool_arr.bool_dd_act_cnt                         =false;
					 this$1.bool_arr.bool_act_rate                           =false;
					 this$1.bool_arr.bool_pj_act_rate                        =false;
					 this$1.bool_arr.bool_new_100_rate                       =false;
					 this$1.bool_arr.bool_dd_100_rate                        =false;
					 this$1.bool_arr.bool_new_fuse_rate                      =false;
					 this$1.bool_arr.bool_dd_fuse_rate                       =false;
					 this$1.bool_arr.bool_new_kd_should_fee                  =false;
					 this$1.bool_arr.bool_new_ft_fee                         =false;
					 this$1.bool_arr.bool_new_arpu                           =false;
					 this$1.bool_arr.bool_kd_should_fee                      =false;
					 this$1.bool_arr.bool_ft_fee                             =false;
					 this$1.bool_arr.bool_arpu                               =false;
					 this$1.bool_arr.bool_mbh_cnt                            =false;
					 this$1.bool_arr.bool_mbh_st_rate                        =false;
					 this$1.bool_arr.bool_d_mbh_new_cnt                      =false;
					 this$1.bool_arr.bool_y_mbh_new_cnt                      =false;
					 this$1.bool_arr.bool_y_jj_mbh_cnt                       =false;
					 this$1.bool_arr.bool_n_jj_mbh_cnt                       =false;
					 this$1.bool_arr.bool_mbh_activation_rate                =false;
					 this$1.bool_arr.bool_y_mbh_activation_rate              =false;
					 this$1.bool_arr.bool_mbh_active_rate                    =false;
					 this$1.bool_arr.bool_mbh_fee                            =false;
					 this$1.bool_arr.bool_lj_mbh_fee                         =false;
					 this$1.bool_arr.bool_hemu_cnt                           =false;
					 this$1.bool_arr.bool_hemu_new_cnt                       =false;
					 this$1.bool_arr.bool_tel_cnt                            =false;
					 this$1.bool_arr.bool_tel_new_cnt                        =false;
					 this$1.bool_arr.bool_y_lw_cnt                           =true;
					 this$1.bool_arr.bool_lw_rate                            =true;
					 this$1.bool_arr.bool_dd_off_cnt                         =false;
					 this$1.bool_arr.bool_port_conver_rate                   =false;
					break;
				}
				default:{
					alert('error');
					break;
				}
				
			}
			this.bool_arr = this$1.bool_arr;
		}
		
  },
	mounted:function(){
		initMap();
		this.initlistener();
		this.featureClick({
			properties:{
				name:this.province,
				adcode:this.provincecode
			}
		});
        this.createPieCharts(this.province,'COVER_COUNT');
	}
});
}

function getInfo(KEY,callback){
if(!CMMap.PoiSearch||!CMMap.PoiSearch.PoiByKeywords)
	return;
var s = new CMMap.PoiSearch.PoiByKeywords({
						keywords: KEY,
						city: '210000'
			});
s.search(function(status, result) {
	if(callback){
		callback(status, result);
	}
});
}

function getAreaInfo(KEY,adcode,callback){
if(!CMMap.PoiSearch||!CMMap.PoiSearch.PoiByKeywords)
return;
var s = new CMMap.PoiSearch.PoiByKeywords({
		  keywords: KEY,
		  city: adcode
	});
s.search(function(status, result) {
if(callback){
  callback(status, result);
}
});
}

