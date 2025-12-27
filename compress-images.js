/**
 * 图片压缩脚本
 * 使用 sharp 库压缩 PNG 和 JPG 图片
 * 
 * 使用方法：
 * 1. 安装依赖: npm install
 * 2. 运行脚本: node compress-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 配置
const CONFIG = {
    // 压缩质量 (0-100, 80-90 是好的平衡点)
    quality: 85,
    // 是否覆盖原文件 (false = 创建备份, true = 直接覆盖)
    overwrite: true,
    // 要压缩的文件夹
    folders: ['photos', 'comics'],
    // 最大文件大小 (MB)，超过此大小的文件会被压缩
    maxSizeMB: 0.5
};

// 统计信息
const stats = {
    total: 0,
    compressed: 0,
    skipped: 0,
    errors: 0,
    originalSize: 0,
    compressedSize: 0
};

/**
 * 获取文件大小 (MB)
 */
function getFileSizeMB(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size / (1024 * 1024);
}

/**
 * 压缩单个图片
 */
async function compressImage(inputPath) {
    try {
        const originalSize = getFileSizeMB(inputPath);
        stats.originalSize += originalSize;

        // 如果文件小于 maxSizeMB，跳过
        if (originalSize < CONFIG.maxSizeMB) {
            console.log(`⏭️  跳过 (${originalSize.toFixed(2)}MB < ${CONFIG.maxSizeMB}MB): ${path.basename(inputPath)}`);
            stats.skipped++;
            return;
        }

        // 创建临时文件路径
        const tempPath = inputPath + '.tmp';
        const ext = path.extname(inputPath).toLowerCase();

        // 压缩图片到临时文件
        if (ext === '.png') {
            await sharp(inputPath)
                .png({ quality: CONFIG.quality, compressionLevel: 9 })
                .toFile(tempPath);
        } else if (['.jpg', '.jpeg'].includes(ext)) {
            await sharp(inputPath)
                .jpeg({ quality: CONFIG.quality, mozjpeg: true })
                .toFile(tempPath);
        } else {
            // 其他格式，尝试自动处理
            await sharp(inputPath)
                .toFile(tempPath);
        }

        const compressedSize = getFileSizeMB(tempPath);
        const saved = originalSize - compressedSize;
        const savedPercent = ((saved / originalSize) * 100).toFixed(1);

        // 如果压缩后更小，替换原文件
        if (compressedSize < originalSize) {
            // 删除原文件
            fs.unlinkSync(inputPath);
            // 重命名临时文件
            fs.renameSync(tempPath, inputPath);
            
            stats.compressedSize += compressedSize;
            stats.compressed++;

            console.log(`✅ 压缩: ${path.basename(inputPath)}`);
            console.log(`   ${originalSize.toFixed(2)}MB → ${compressedSize.toFixed(2)}MB (节省 ${savedPercent}%)`);
        } else {
            // 压缩后更大，删除临时文件，保留原文件
            fs.unlinkSync(tempPath);
            console.log(`⏭️  跳过: ${path.basename(inputPath)} (压缩后更大，保留原文件)`);
            stats.skipped++;
        }
    } catch (error) {
        // 清理可能的临时文件
        const tempPath = inputPath + '.tmp';
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
        console.error(`❌ 错误: ${path.basename(inputPath)} - ${error.message}`);
        stats.errors++;
    }
}

/**
 * 处理文件夹中的所有图片
 */
async function processFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        console.log(`⚠️  文件夹不存在: ${folderPath}`);
        return;
    }

    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(file => 
        /\.(png|jpg|jpeg)$/i.test(file)
    );

    console.log(`\n📁 处理文件夹: ${folderPath}`);
    console.log(`   找到 ${imageFiles.length} 张图片\n`);

    for (const file of imageFiles) {
        stats.total++;
        const inputPath = path.join(folderPath, file);
        
        if (!CONFIG.overwrite) {
            // 创建备份
            const backupPath = path.join(folderPath, `backup_${file}`);
            fs.copyFileSync(inputPath, backupPath);
        }
        
        // 压缩图片（会自动处理临时文件和替换）
        await compressImage(inputPath);
    }
}

/**
 * 主函数
 */
async function main() {
    console.log('🚀 开始压缩图片...\n');
    console.log('配置:');
    console.log(`  - 质量: ${CONFIG.quality}`);
    console.log(`  - 覆盖原文件: ${CONFIG.overwrite ? '是' : '否 (会创建备份)'}`);
    console.log(`  - 最小压缩大小: ${CONFIG.maxSizeMB}MB\n`);

    // 检查是否安装了 sharp
    try {
        require('sharp');
    } catch (error) {
        console.error('❌ 错误: 未安装 sharp 库');
        console.log('\n请先运行: npm install sharp');
        process.exit(1);
    }

    // 处理所有文件夹
    for (const folder of CONFIG.folders) {
        const folderPath = path.join(__dirname, folder);
        
        // 如果是 comics 文件夹，需要处理子文件夹
        if (folder === 'comics') {
            const subfolders = fs.readdirSync(folderPath).filter(item => {
                const itemPath = path.join(folderPath, item);
                return fs.statSync(itemPath).isDirectory();
            });
            
            for (const subfolder of subfolders) {
                await processFolder(path.join(folderPath, subfolder));
            }
        } else {
            await processFolder(folderPath);
        }
    }

    // 显示统计信息
    console.log('\n' + '='.repeat(50));
    console.log('📊 压缩统计:');
    console.log(`   总文件数: ${stats.total}`);
    console.log(`   已压缩: ${stats.compressed}`);
    console.log(`   已跳过: ${stats.skipped}`);
    console.log(`   错误: ${stats.errors}`);
    console.log(`   原始大小: ${stats.originalSize.toFixed(2)}MB`);
    console.log(`   压缩后大小: ${stats.compressedSize.toFixed(2)}MB`);
    console.log(`   节省空间: ${(stats.originalSize - stats.compressedSize).toFixed(2)}MB`);
    console.log(`   压缩率: ${(((stats.originalSize - stats.compressedSize) / stats.originalSize) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));
}

// 运行
main().catch(console.error);

