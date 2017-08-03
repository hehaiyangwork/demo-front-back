package club.itbus.controller;

import club.itbus.jwt.Constant;
import club.itbus.jwt.JwtUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @RestController注解作用：为该controller类下的所有方法添加@ResponseBody注解
 */
//@RestController
@Controller
@RequestMapping
public class SimpleController {

    @ResponseBody
    @RequestMapping(value = "/api/now", method = RequestMethod.GET)
    public Map<String,Object> now(HttpServletRequest request) {
        Map<String,Object> map = new HashMap<>();
        map.put("message", new Date());
        return map;
    }

    @ResponseBody
    @RequestMapping(value = "/api/user", method = RequestMethod.GET)
    public Map<String,Object> user(HttpServletRequest request) {
        Map<String,Object> map = new HashMap<>();
        map.put("username", "hehaiyang");
        map.put("gender", "男");
        return map;
    }

    @ResponseBody
    @RequestMapping(value = "/api/index", method = RequestMethod.GET)
    public Map<String,Object> index(HttpServletRequest request) {
        Map<String,Object> map = new HashMap<>();
        map.put("username", "index");
        return map;
    }

    @ResponseBody
    @RequestMapping(value = "/api/user/index", method = RequestMethod.GET)
    public Map<String,Object> userIndex(HttpServletRequest request) {
        Map<String,Object> map = new HashMap<>();
        map.put("username", "userIndex");
        return map;
    }

    @ResponseBody
    @RequestMapping(value = "/api/login", method = RequestMethod.POST)
    public Map<String,Object> login() {
        Map<String,Object> map = new HashMap<>();
        map.put("token", JwtUtil.createJWT(Constant.JWT_ID, "{\"name\":\"hehaiyang\"}", Constant.JWT_TTL));
        return map;
    }

    @ResponseBody
    @RequestMapping(value = "/api/user/info", method = RequestMethod.GET)
    public Map<String,Object> redis(HttpServletRequest request) {
        String auth = request.getHeader("Token");
        System.out.println(auth);
        JwtUtil.parseJWT(auth);

        Map<String,Object> map = new HashMap<>();
        map.put("username", "hehaiyang");
        map.put("gender", "1");

        return map;
    }


}