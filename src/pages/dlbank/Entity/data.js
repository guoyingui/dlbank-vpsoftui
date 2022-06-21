import React, { Component } from 'react'
import {
  VpTooltip,
  VpIconFont,
} from 'vpreact'

// 处理特定实体名称显示问题
function getPjTreeHeader() {
  return [
    {
      title: '名称',
      dataIndex: 'sname',
      key: 'sname',
      width: 250,
      fixed: '',
      render: (text, record) => {
        switch (record.ientityid) {
          case "7":
            return (
              <div className="inline-display">
                <VpTooltip title="项目">
                  <VpIconFont type="vpicon-project m-lr-xs text-success" />
                </VpTooltip>
                {text}
              </div>
            )
            break;
          case "6":
            return (
              <div className="inline-display">
                <VpTooltip title="项目群">
                  <VpIconFont type="vpicon-wenben m-lr-xs text-primary" />
                </VpTooltip>
                {text}
              </div>
            )
            break;
          case "8":
            return (
              <div className="inline-display">
                <VpTooltip title="子项目">
                  <VpIconFont type="vpicon-file-text m-lr-xs text-info" />
                </VpTooltip>
                {text}
              </div>
            )
            break;
          case "114":
            return (
              <div className="inline-display">
                <VpTooltip title="任务">
                  <VpIconFont type="vpicon-file-zip m-lr-xs text-warning" />
                </VpTooltip>
                {text}
              </div>
            )
            break;
          default:
            return (
              <div className="inline-display">
                {text}
              </div>
            )
            break;
        }
      }
    },
    {
      title: '编号',
      dataIndex: 'scode',
      key: 'scode',
      width: '',
      fixed: ''
    },
    {
      title: '类别',
      dataIndex: 'iclassid',
      key: 'iclassid',
      width: '',
      fixed: ''
    },
    {
      title: '状态',
      dataIndex: 'istatusid',
      key: 'istatusid',
      width: '',
      fixed: ''
    },
    {
      title: '归属部门',
      dataIndex: 'idepartmentid',
      key: 'idepartmentid',
      width: '',
      fixed: ''
    },
    {
      title: '上级项目群组',
      dataIndex: 'iparent',
      key: 'iparent',
      width: '',
      fixed: ''
    },
    {
      title: '负责人',
      dataIndex: 'inamerole',
      key: 'inamerole',
      width: '',
      fixed: ''
    },
  ];
}

export {
  getPjTreeHeader,
}