using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using HergBot.AuthServer.Contexts;
using HergBot.AuthServer.Models;

namespace HergBot.AuthServer.Controllers.V1
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly AuthServerContext _context;

        public ServiceController(AuthServerContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Service> Get()
        {
            return _context.Service;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Service>> GetTransaction(int id)
        {
            try
            {
                Service found = await _context.Service.FindAsync(id);
                if (found == null)
                {
                    return NotFound();
                }
                return found;
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        public override NotFoundResult NotFound()
        {
            //return base.NotFound();
            return new NotFoundResult();
        }
    }
}
