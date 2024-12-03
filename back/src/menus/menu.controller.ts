import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Controller({ version: '1', path: '/menu' })
@UseGuards(AuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  getTest(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Get('/today')
  getMenus(@Req() request: Request) {
    const uid = request.cookies['nhn-eat-uid'];
    return this.menuService.getTodayMenus(uid);
  }

  @Post('/crawling')
  async insertMenusFromVelog(@Req() request: Request) {
    const date = request.query.date;
    console.log(date);
    // const html = await axios.get(``);
    // const $ = cheerio.load(html.data);
    // const atomOneDiv = $('.atom-one');
    // const targetTag = atomOneDiv
    //   .find('p')
    //   .filter((i, el) => $(el).text().includes('메뉴 갯수'));

    // const menuCount = parseInt(targetTag.text().trim().match(/\d+$/)?.[0]);

    // const menus = [];

    // for (let i = 1; i <= menuCount; i++) {
    //   menus.push({
    //     name: atomOneDiv
    //       .find('p')
    //       .filter((_, el) => $(el).text().includes(`메뉴${i} 이름`))
    //       .text()
    //       .split('\n')[1],
    //     mealType: atomOneDiv
    //       .find('p')
    //       .filter((_, el) => $(el).text().includes(`메뉴${i} 언제`))
    //       .text()
    //       .split('\n')[1],
    //     description: atomOneDiv
    //       .find('p')
    //       .filter((_, el) => $(el).text().includes(`메뉴${i} 디테일`))
    //       .text()
    //       .split('\n')[1],
    //     calories: atomOneDiv
    //       .find('p')
    //       .filter((_, el) => $(el).text().includes(`메뉴${i} 칼로리`))
    //       .text()
    //       .split('\n')[1],
    //     imageUrl: atomOneDiv
    //       .find('p')
    //       .filter((_, el) => $(el).text().includes(`메뉴${i} 이미지`))
    //       .html()
    //       .split('\n')[1]
    //       .split('"')[1],
    //     isLunchBox: atomOneDiv
    //       .find('p')
    //       .filter((_, el) => $(el).text().includes(`메뉴${i} 이미지`))
    //       .html()
    //       .split('\n')[1]
    //       .split('"')[1],
    //     date: date,
    //   });
    // }

    // console.log(menus);
  }
}
// 메뉴1 이름
// 대파 육개장

// 메뉴1 언제
// 중식

// 메뉴1 디테일
// 15곡잡곡밥, 비엔나소시지볶음, 어묵조림, 오이양파무침

// 메뉴1 칼로리
// 753

// 메뉴1 이미지
