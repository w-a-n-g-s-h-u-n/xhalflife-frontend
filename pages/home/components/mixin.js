import { XHalfLifeContract } from '@/api/contract';
import multicall from 'xdefi-assets/abi/Multicall.json'
import { ethers } from 'ethers'
import registry from 'xdefi-assets/generated/pm/registry.homestead.json';
import registryKovan from 'xdefi-assets/generated/pm/registry.kovan.json';
import {isKovanEnv} from '../../../utils'; 
import halflifeContract from '@/api/contract/abis/XHalfLife.json'
import { provider } from '@/api/contract/ethers';

const addresses = isKovanEnv() ? registryKovan.addresses : registry.addresses;

const halflifeContractAddress = process.env.XHALFLIFE_CONTRACT_ADDTRESS

export default {
  data () {
    return {
      streamIdQueue: [], // 请求队列
      reqCount: {} // 请求次数
    }
  },
  methods: {
    async refreshBalanceOfStreams (ids) {
      if (ids && ids.length) {
        this.streamIdQueue = ids // 初始化
        this.reqCount = {}
      }
      if (!this.streamIdQueue.length) {
        return
      }

      const multi = new ethers.Contract(
        addresses.multicall,
        multicall.abi,
        provider
      );


      const calls = [];
      const promises = [];
      const xhalflifeContract = new ethers.utils.Interface(halflifeContract);

      this.streamIdQueue.forEach(id => {
        calls.push([halflifeContractAddress, xhalflifeContract.encodeFunctionData('balanceOf', [id])]);
      });
      promises.push(multi.aggregate(calls));
      const dataIds = [];

      try{
        // @ts-ignore
        const [[,response]] = await Promise.all(promises);
        this.streamIdQueue.forEach((id, index) => {
          const decodeData = xhalflifeContract.decodeFunctionResult('balanceOf', response[index]);
          this.$store.commit('updateBalanceByStreamId', { key: id, value: decodeData })
        })
      }catch (e){


        console.error(e)
        //this.$message.error('error')

      }
    },
  }
}
