<template>
  <div style="padding:20px;">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="padding:20px;">
        <span>基本信息</span>
      </div>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="always" class="my-card" style="text-align: center;">
            <div>粉丝数</div>
            <div>50</div>
            <div>昨日敬赠：0</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always" class="my-card" style="text-align: center;">
            <div>粉丝阅读累计阅读数</div>
            <div>3000</div>
            <div>累计阅读数：0</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always" class="my-card" style="text-align: center;">
            <div>月度粉丝收益</div>
            <div>800元</div>
            <div>月度累计收益：800元</div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 下面图表 -->
    <el-card class="box-card" style="margin-top:20px;">
      <div slot="header" class="clearfix" style="padding:20px;">
        <span>数据分析</span>
      </div>

      <!-- 图表的容器 -->
      <div ref="wrap" style="height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 导包
import echarts from 'echarts'

export default {
  mounted() {
    // 1. 实例化echarts对象，并传入容器
    let myChart = echarts.init(this.$refs.wrap);

    // 2. 准备图表的配置
    let option = {
      title: {
        text: "折线图堆叠"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "邮件营销",
          type: "line",
          stack: "总量",
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: "联盟广告",
          type: "line",
          stack: "总量",
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: "视频广告",
          type: "line",
          stack: "总量",
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: "直接访问",
          type: "line",
          stack: "总量",
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: "搜索引擎",
          type: "line",
          stack: "总量",
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    };

    // 3. 让echarts对象应用这个配置
    myChart.setOption(option)
  }
};
</script>

<style>
</style>